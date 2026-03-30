# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('person', '0004_alter_person_group'),
    ]

    operations = [
        migrations.AddField(
            model_name='person',
            name='is_generic',
            field=models.BooleanField(default=False, help_text='Indicates if this is a generic placeholder person'),
        ),
        migrations.AlterField(
            model_name='person',
            name='email',
            field=models.EmailField(blank=True, max_length=254, null=True, unique=True),
        ),
    ]
