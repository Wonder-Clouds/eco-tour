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

        # Recalculate the total before to show total
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

    @action(detail=True, methods=['post'], url_path='add-services-bulk')
    def add_services_bulk(self, request, pk=None):
        """
        Add multiple services for multiple persons in a single request.
        Supports mixing real persons and generic persons.
        Use person_temp_id to group services for the same generic person.
        """
        from person.models import Person
        from service.models import Service
        from django.db import transaction
        
        quote = self.get_object()
        services_data = request.data.get('services', [])
        
        if not services_data or not isinstance(services_data, list):
            return Response(
                {"services": "This field is required and must be a list."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        created_services = []
        errors = []
        
        # Map to store created generic persons by their temp_id
        generic_persons_map = {}
        
        # Track person+service combinations to prevent duplicates
        person_service_combinations = set()
        
        # Use transaction to rollback if any error occurs
        try:
            with transaction.atomic():
                for index, service_data in enumerate(services_data):
                    service_id = service_data.get('service_id')
                    person_id = service_data.get('person_id')
                    person_temp_id = service_data.get('person_temp_id')
                    notes = service_data.get('notes', '')
                    
                    # Validate service_id
                    if not service_id:
                        errors.append({
                            "index": index,
                            "error": "service_id is required"
                        })
                        continue
                    
                    # Determine which person to use
                    actual_person_id = None
                    
                    if person_id:
                        # Use existing real person
                        actual_person_id = person_id
                        data = {
                            'service_id': service_id,
                            'person_id': person_id,
                            'notes': notes,
                            'quote_id': str(quote.id)
                        }
                    elif person_temp_id:
                        # Use or create generic person based on temp_id
                        if person_temp_id not in generic_persons_map:
                            # Create new generic person for this temp_id
                            import uuid
                            generic_person = Person.objects.create(
                                first_name="Persona",
                                last_name=f"Genérica {len(generic_persons_map) + 1}",
                                is_generic=True,
                                email=f"generic.{uuid.uuid4().hex[:8]}@noemail.ecotour.com"
                            )
                            generic_person.group.add(quote.group)
                            generic_persons_map[person_temp_id] = generic_person
                        
                        # Use the generic person for this temp_id
                        actual_person_id = str(generic_persons_map[person_temp_id].id)
                        data = {
                            'service_id': service_id,
                            'person_id': actual_person_id,
                            'notes': notes,
                            'quote_id': str(quote.id)
                        }
                    else:
                        # No person specified - create a new generic person
                        import uuid
                        generic_person = Person.objects.create(
                            first_name="Persona",
                            last_name=f"Genérica",
                            is_generic=True,
                            email=f"generic.{uuid.uuid4().hex[:8]}@noemail.ecotour.com"
                        )
                        generic_person.group.add(quote.group)
                        
                        actual_person_id = str(generic_person.id)
                        data = {
                            'service_id': service_id,
                            'person_id': actual_person_id,
                            'notes': notes,
                            'quote_id': str(quote.id)
                        }
                    
                    # Check for duplicate person+service combination in this request
                    combination_key = f"{actual_person_id}_{service_id}"
                    if combination_key in person_service_combinations:
                        errors.append({
                            "index": index,
                            "error": f"Duplicate detected: This person is already assigned to this service in this request."
                        })
                        continue
                    
                    # Check if this person already has this service in the quote (from DB)
                    try:
                        person_obj = Person.objects.get(id=actual_person_id)
                        service_obj = Service.objects.get(id=service_id)
                        
                        existing = ServiceQuotePerson.objects.filter(
                            person=person_obj,
                            service=service_obj,
                            quote=quote
                        ).exists()
                        
                        if existing:
                            errors.append({
                                "index": index,
                                "error": f"This person already has the service '{service_obj.title}' in this quote."
                            })
                            continue
                    except (Person.DoesNotExist, Service.DoesNotExist):
                        pass
                    
                    # Add to tracking set
                    person_service_combinations.add(combination_key)
                    
                    # Create using serializer
                    serializer = ServiceQuotePersonSerializer(data=data)
                    serializer._quote = quote
                    
                    if serializer.is_valid():
                        instance = serializer.save()
                        created_services.append({
                            "index": index,
                            "person_temp_id": person_temp_id if person_temp_id else None,
                            "service_quote_person": ServiceQuotePersonSerializer(instance).data
                        })
                    else:
                        errors.append({
                            "index": index,
                            "errors": serializer.errors
                        })
                
                # If there are errors, rollback transaction
                if errors:
                    raise Exception("Validation errors occurred")
                
                # Update all affected services' prices
                affected_services = set()
                for created in created_services:
                    sqp_data = created['service_quote_person']
                    service_id = sqp_data['service']
                    affected_services.add(service_id)
                
                # Update prices for each affected service
                for service_id in affected_services:
                    try:
                        service = Service.objects.get(id=service_id)
                        update_service_prices_in_quote(service, quote)
                    except Service.DoesNotExist:
                        pass
                
                # Update quote total
                quote.update_total_price()
                quote.refresh_from_db()
        
        except Exception as e:
            return Response(
                {
                    "message": "Failed to create services. All changes have been rolled back.",
                    "errors": errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return Response(
            {
                "message": f"Successfully created {len(created_services)} service assignments.",
                "created": created_services,
                "generic_persons_created": len(generic_persons_map),
                "quote_total": str(quote.total_price),
                "total_services_in_quote": quote.servicequoteperson_set.count()
            },
            status=status.HTTP_201_CREATED
        )


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


