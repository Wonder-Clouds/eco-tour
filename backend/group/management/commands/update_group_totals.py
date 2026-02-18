from django.core.management.base import BaseCommand
from group.models import Group


class Command(BaseCommand):
    help = 'Update total_people count for all groups based on non-generic persons'

    def handle(self, *args, **options):
        groups = Group.objects.all()
        updated_count = 0
        
        self.stdout.write('Starting to update total_people for all groups...')
        
        for group in groups:
            old_total = group.total_people
            new_total = group.update_people_count()
            
            if old_total != new_total:
                self.stdout.write(
                    self.style.SUCCESS(
                        f'Updated group "{group.name}": {old_total} -> {new_total} people'
                    )
                )
                updated_count += 1
            else:
                self.stdout.write(
                    f'Group "{group.name}" already has correct count: {new_total} people'
                )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'\nFinished! Updated {updated_count} out of {groups.count()} groups.'
            )
        )
