from django.db.models.signals import m2m_changed
from django.dispatch import receiver
from .models import Person


@receiver(m2m_changed, sender=Person.group.through)
def update_group_total_people(sender, instance, action, pk_set, **kwargs):
    """
    Update the total_people count in a group whenever persons are added or removed.
    This signal is triggered when the many-to-many relationship changes.
    """
    if action in ['post_add', 'post_remove', 'post_clear']:
        # Get all groups affected
        from group.models import Group
        
        if action == 'post_clear':
            # If clearing all groups, we need to update all groups the person was in
            # This is tricky, so we'll update all groups to be safe
            groups = Group.objects.all()
        else:
            # Get the specific groups that were modified
            groups = Group.objects.filter(pk__in=pk_set) if pk_set else []
            # Also update the instance's current groups
            if hasattr(instance, 'group'):
                groups = list(groups) + list(instance.group.all())
        
        # Update total_people for each affected group
        for group in set(groups):
            # Count non-generic persons in this group
            total = group.person.filter(is_generic=False).count()
            if group.total_people != total:
                group.total_people = total
                group.save(update_fields=['total_people'])
