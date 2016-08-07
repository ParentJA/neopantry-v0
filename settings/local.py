# Local imports...
from .base import *

__author__ = 'Jason Parent'

DEBUG = True

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

STATIC_ROOT = os.path.join(BASE_DIR, 'static')

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'www/app/src'),
    os.path.join(BASE_DIR, 'www/site/src'),
    os.path.join(BASE_DIR, 'www/dist'),
    os.path.join(BASE_DIR, 'www/bower_components'),
)
