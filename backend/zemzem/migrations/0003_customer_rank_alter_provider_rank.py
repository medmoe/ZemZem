# Generated by Django 4.0.5 on 2022-08-11 11:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('zemzem', '0002_remove_order_reasonoffailure_order_customercomment_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='rank',
            field=models.CharField(default='0:0', max_length=200),
        ),
        migrations.AlterField(
            model_name='provider',
            name='rank',
            field=models.CharField(default='0:0', max_length=200),
        ),
    ]
