# Generated by Django 3.2.8 on 2021-10-27 16:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('report', '0002_machine_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='materialsandsundries',
            name='project_day',
            field=models.ForeignKey(default=55, on_delete=django.db.models.deletion.CASCADE, to='report.projectday'),
            preserve_default=False,
        ),
    ]