from django.contrib.auth.models import User
from django.db import models


class AIGenerationLog(models.Model):
    """Registro de geração de conteúdo por IA."""

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='ai_generations')
    prompt = models.TextField()
    model_name = models.CharField(max_length=100, blank=True)
    output = models.TextField()
    metadata = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return self.prompt[:60]


class HashtagCache(models.Model):
    """Cache de hashtags e trends para sugestões rápidas."""

    query = models.CharField(max_length=200, unique=True)
    hashtags = models.JSONField(blank=True, null=True)
    source = models.CharField(max_length=100, blank=True)
    last_updated = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f'HashtagCache {self.query}'
