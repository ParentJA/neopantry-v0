# Third-party imports...
from localflavor.us.models import PhoneNumberField

# Django imports...
from django.contrib.auth.models import AbstractUser
from django.db import models

__author__ = 'jason.a.parent@gmail.com (Jason Parent)'


class User(AbstractUser):
    photo = models.ImageField(upload_to='photos', default='photos/no-image.jpg', blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    phone_number = PhoneNumberField(blank=True, null=True)

    def __unicode__(self):
        return self.get_full_name()

    @property
    def photo_url(self):
        try:
            return self.photo.url
        except ValueError:
            return None
