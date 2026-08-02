from django.contrib.auth.models import User
from django.db import models


class SocialAccount(models.Model):
    """Conta social conectada via OAuth para uma plataforma externa."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='social_accounts')
    team = models.ForeignKey('accounts.Team', on_delete=models.SET_NULL, null=True, blank=True, related_name='social_accounts')
    platform = models.CharField(max_length=50)
    platform_user_id = models.CharField(max_length=100, unique=True)
    username = models.CharField(max_length=100)
    display_name = models.CharField(max_length=150, blank=True)
    avatar_url = models.URLField(blank=True)
    bio = models.TextField(blank=True)
    followers_count = models.IntegerField(default=0)
    following_count = models.IntegerField(default=0)
    posts_count = models.IntegerField(default=0)
    access_token = models.TextField(blank=True)
    refresh_token = models.TextField(blank=True)
    token_expires_at = models.DateTimeField(null=True, blank=True)
    scopes = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    connected_at = models.DateTimeField(auto_now_add=True)
    last_synced_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'conta social'
        verbose_name_plural = 'contas sociais'

    def __str__(self) -> str:
        return f'{self.platform}:{self.username}'
