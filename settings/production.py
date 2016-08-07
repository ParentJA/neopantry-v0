# Local imports...
from .base import *

__author__ = 'Jason Parent'

DEBUG = False

ALLOWED_HOSTS = ['neopantry.com']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': os.getenv('DATABASE_NAME'),
        'USER': os.getenv('DATABASE_USER'),
        'PASSWORD': os.getenv('DATABASE_PASS'),
        'HOST': 'localhost',
        'PORT': 5432
    }
}

STATIC_ROOT = os.path.abspath(os.path.join(BASE_DIR, '../static'))

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'www/app/dist'),
    os.path.join(BASE_DIR, 'www/site/dist'),
)
