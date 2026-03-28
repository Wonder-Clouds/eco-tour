from django.db.models.signals import m2m_changed, post_save, post_delete
from django.dispatch import receiver
from person.models import Person
from group.models import Group

@receiver(m2m_changed, sender=Person.group.through)
def update_group_people_count(sender, instance, action, reverse, model, pk_set, **kwargs):
    if action in ["post_add", "post_remove", "post_clear"]:
        if reverse:
            # instance es el Grupo
            instance.update_people_count()
        else:
            # instance es Person, pk_set son los grupos
            if pk_set:
                for gid in pk_set:
                    try:
                        g = Group.objects.get(pk=gid)
                        g.update_people_count()
                    except Group.DoesNotExist:
                        pass


@receiver(post_delete, sender=Person)
def update_groups_on_person_delete(sender, instance, **kwargs):
    groups = instance.group.all()
    for group in groups:
        group.update_people_count()
