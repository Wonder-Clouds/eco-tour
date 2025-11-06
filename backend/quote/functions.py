from quote.models import ServiceQuotePerson

def calculate_service_unit_price(service, quote, exclude_instance=None):
    """
    Calculate unit price for a service based on its type and number of people in the quote.
    
    Args:
        service: Service instance
        quote: Quote instance  
        exclude_instance: ServiceQuotePerson instance to exclude from count (for updates)
    
    Returns:
        Decimal: The calculated unit price
    """
    if service.type == 'group':
        return service.price
    
    elif service.type in ['private', 'arbitrary']:
        # Count people opting for this service in this quote
        queryset = ServiceQuotePerson.objects.filter(
            quote=quote,
            service=service
        )
        
        # Exclude specific instance if provided (useful for updates)
        if exclude_instance:
            queryset = queryset.exclude(id=exclude_instance.id)
        
        people_count = queryset.count()
        
        # For creation, we need to add 1 to count the new person being added
        # For updates, the count is already correct since we excluded the instance
        if exclude_instance is None:  # This means we're creating, so add 1
            people_count += 1
        
        # If still no people, return full price
        if people_count == 0:
            return service.price
            
        return service.price / people_count
    
    return service.price


def update_service_prices_in_quote(service, quote, exclude_instance=None):
    """
    Update unit prices for all ServiceQuotePerson records of a specific service in a quote.
    
    Args:
        service: Service instance
        quote: Quote instance
        exclude_instance: ServiceQuotePerson instance to exclude from update
    """
    if service.type not in ['private', 'arbitrary']:
        return
    
    queryset = ServiceQuotePerson.objects.filter(
        service=service,
        quote=quote
    )
    
    if exclude_instance:
        queryset = queryset.exclude(id=exclude_instance.id)
    
    people_count = queryset.count()
    if people_count > 0:
        new_unit_price = service.price / people_count
        queryset.update(unit_price=new_unit_price)
