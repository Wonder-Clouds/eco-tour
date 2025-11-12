from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Quote, ServiceQuotePerson
from .serializers import QuoteSerializer, SimpleQuoteSerializer, ServiceQuotePersonSerializer
from .functions import update_service_prices_in_quote

class QuoteViewSet(viewsets.ModelViewSet):
    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer

    def get_serializer_class(self):
        if self.action == 'list':
            return SimpleQuoteSerializer
        return QuoteSerializer

    @action(detail=True, methods=['post'], url_path='add-service')
    def add_service(self, request, pk=None):
        """Add a service to this quote for a person"""
        quote = self.get_object()
        data = request.data.copy()
        
        serializer = ServiceQuotePersonSerializer(data=data)
        serializer._quote = quote
        
        if serializer.is_valid():
            service_quote_person = serializer.save()
            # Forzar actualización del total después de agregar servicio
            quote.update_total_price()
            return Response(
                ServiceQuotePersonSerializer(service_quote_person).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'], url_path='services')
    def services(self, request, pk=None):
        """Get all services in this quote"""
        quote = self.get_object()
        services = ServiceQuotePerson.objects.filter(quote=quote)
        serializer = ServiceQuotePersonSerializer(services, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'], url_path='totals')
    def totals(self, request, pk=None):
        """Get detailed totals breakdown for this quote"""
        quote = self.get_object()
        # Recalcular el total antes de devolver la respuesta
        quote.update_total_price()
        quote.refresh_from_db()
        
        serializer = QuoteSerializer(quote)
        
        return Response({
            'quote_total': quote.total_price,
            'service_total_by_person': serializer.data['service_total_by_person'],
            'services_count': quote.servicequoteperson_set.count()
        })

    @action(detail=True, methods=['post'], url_path='recalculate-total')
    def recalculate_total(self, request, pk=None):
        """Recalculate total price for this quote"""
        quote = self.get_object()
        old_total = quote.total_price
        quote.update_total_price()
        quote.refresh_from_db()
        
        return Response({
            'old_total': old_total,
            'new_total': quote.total_price,
            'services_count': quote.servicequoteperson_set.count(),
            'message': 'Total recalculated successfully'
        })


class ServiceQuotePersonViewSet(viewsets.ModelViewSet):
    queryset = ServiceQuotePerson.objects.all()
    serializer_class = ServiceQuotePersonSerializer

    def perform_create(self, serializer):
        """Override create to ensure total is updated"""
        instance = serializer.save()
        instance.quote.update_total_price()

    def perform_update(self, serializer):
        """Override update to ensure total is updated"""
        instance = serializer.save()
        instance.quote.update_total_price()

    def perform_destroy(self, instance):
        """Recalculate prices after deletion"""
        service = instance.service
        quote = instance.quote
        super().perform_destroy(instance)
        update_service_prices_in_quote(service, quote)
        quote.update_total_price()

    @action(detail=True, methods=['patch'], url_path='assign-person')
    def assign_person(self, request, pk=None):
        """Replace generic person with a real person"""
        from person.models import Person
        
        service_quote_person = self.get_object()
        person_id = request.data.get('person_id')
        notes = request.data.get('notes', service_quote_person.notes)
        
        # Validate person_id is provided
        if not person_id:
            return Response(
                {"person_id": "This field is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get the new person
        try:
            new_person = Person.objects.get(id=person_id)
        except Person.DoesNotExist:
            return Response(
                {"person_id": "Invalid person ID."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Validate that person belongs to the quote's group
        if service_quote_person.quote.group not in new_person.group.all():
            return Response(
                {"person_id": f"The person must belong to the group '{service_quote_person.quote.group.name}' associated with this quote."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if the new person already has this service in this quote
        if not new_person.is_generic:
            existing = ServiceQuotePerson.objects.filter(
                person=new_person,
                service=service_quote_person.service,
                quote=service_quote_person.quote
            ).exclude(id=service_quote_person.id).exists()
            
            if existing:
                return Response(
                    {"person_id": f"The person '{new_person}' already has the service '{service_quote_person.service}' in this quote."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Store old person to check if it was generic
        old_person = service_quote_person.person
        was_generic = old_person.is_generic
        
        # Update the person
        service_quote_person.person = new_person
        service_quote_person.notes = notes
        
        # Recalculate unit price
        from .functions import calculate_service_unit_price
        service_quote_person.unit_price = calculate_service_unit_price(
            service_quote_person.service,
            service_quote_person.quote,
            exclude_instance=service_quote_person
        )
        
        service_quote_person.save()
        
        # Update prices for this service in the quote
        update_service_prices_in_quote(
            service_quote_person.service,
            service_quote_person.quote
        )
        
        # Update quote total
        service_quote_person.quote.update_total_price()
        
        return Response(
            {
                "message": f"Person updated from '{old_person}' to '{new_person}' successfully.",
                "was_generic": was_generic,
                "service_quote_person": ServiceQuotePersonSerializer(service_quote_person).data
            },
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['patch'], url_path='update-generic-person')
    def update_generic_person(self, request, pk=None):
        """Convert generic person to real person by updating their information"""
        from person.models import Person
        
        service_quote_person = self.get_object()
        
        # Validate that current person is generic
        if not service_quote_person.person.is_generic:
            return Response(
                {"error": "This person is not generic. Use 'assign-person' endpoint to replace with another person."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get data from request
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        email = request.data.get('email', None)
        phone_number = request.data.get('phone_number', None)
        passport_number = request.data.get('passport_number', None)
        birth_date = request.data.get('birth_date', None)
        nationality = request.data.get('nationality', None)
        notes = request.data.get('notes', service_quote_person.notes)
        
        # Validate required fields
        if not first_name or not last_name:
            return Response(
                {"error": "first_name and last_name are required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if a person with this email already exists (if email provided)
        if email:
            existing_person = Person.objects.filter(email=email).first()
            if existing_person and existing_person.id != service_quote_person.person.id:
                return Response(
                    {"email": f"A person with email '{email}' already exists."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Check if person with same first_name and last_name exists in the group (not generic)
        existing_in_group = Person.objects.filter(
            first_name=first_name,
            last_name=last_name,
            is_generic=False,
            group=service_quote_person.quote.group
        ).first()
        
        if existing_in_group:
            return Response(
                {
                    "error": f"A person with name '{first_name} {last_name}' already exists in this group.",
                    "suggestion": f"Use 'assign-person' endpoint with person_id: {existing_in_group.id}"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update the generic person to become a real person
        generic_person = service_quote_person.person
        generic_person.first_name = first_name
        generic_person.last_name = last_name
        generic_person.email = email
        generic_person.phone_number = phone_number
        generic_person.passport_number = passport_number
        generic_person.birth_date = birth_date
        generic_person.nationality = nationality
        generic_person.is_generic = False
        generic_person.save()
        
        # Update notes if provided
        if notes != service_quote_person.notes:
            service_quote_person.notes = notes
            service_quote_person.save()
        
        # Update all other ServiceQuotePerson records with this same generic person
        # to point to the now-real person
        all_services_with_person = ServiceQuotePerson.objects.filter(
            person=generic_person
        )
        
        return Response(
            {
                "message": f"Generic person successfully converted to '{generic_person.first_name} {generic_person.last_name}'.",
                "updated_person": {
                    "id": str(generic_person.id),
                    "first_name": generic_person.first_name,
                    "last_name": generic_person.last_name,
                    "email": generic_person.email,
                    "phone_number": generic_person.phone_number,
                    "passport_number": generic_person.passport_number,
                    "birth_date": generic_person.birth_date,
                    "nationality": generic_person.nationality,
                    "is_generic": generic_person.is_generic
                },
                "affected_services_count": all_services_with_person.count(),
                "service_quote_person": ServiceQuotePersonSerializer(service_quote_person).data
            },
            status=status.HTTP_200_OK
        )


