import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quote', '0003_remove_servicequoteperson_subtotal_and_more'),
    ]

    operations = [
        # Paso 1: Agregar una columna temporal UUID
        migrations.AddField(
            model_name='servicequoteperson',
            name='new_id',
            field=models.UUIDField(default=uuid.uuid4, null=True),
        ),
        
        # Paso 2: Llenar la columna temporal con UUIDs
        migrations.RunSQL(
            "UPDATE quote_servicequoteperson SET new_id = gen_random_uuid();",
            reverse_sql="UPDATE quote_servicequoteperson SET new_id = NULL;"
        ),
        
        # Paso 3: Eliminar la restricción de clave primaria antigua
        migrations.RunSQL(
            "ALTER TABLE quote_servicequoteperson DROP CONSTRAINT quote_servicequoteperson_pkey CASCADE;",
            reverse_sql="-- Cannot reverse this operation"
        ),
        
        # Paso 4: Eliminar la columna id antigua
        migrations.RemoveField(
            model_name='servicequoteperson',
            name='id',
        ),
        
        # Paso 5: Renombrar new_id a id
        migrations.RenameField(
            model_name='servicequoteperson',
            old_name='new_id',
            new_name='id',
        ),
        
        # Paso 6: Hacer que la nueva columna sea primary key y not null
        migrations.AlterField(
            model_name='servicequoteperson',
            name='id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
        ),
    ]