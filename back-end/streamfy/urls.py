
from django.contrib import admin
from django.urls import path
import streamfy.api as A


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', A.Api.urls ),
]
