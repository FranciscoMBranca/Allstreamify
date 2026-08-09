from django.contrib import admin
from .models import User, SocialAccount

@admin.register(SocialAccount)
class SoialAccountAdmin(admin.ModelAdmin):
    list_display = ("id","team", "platform","user",   "connected_at") 
    readonly_fields = ("access_token",)
    exclude = ("token_refrsh",)