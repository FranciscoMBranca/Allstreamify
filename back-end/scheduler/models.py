from django.contrib.auth.models import User
from django.db import models


class ScheduledPost(models.Model):
    """Postagem agendada para múltiplas contas sociais."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='scheduled_posts')
    team = models.ForeignKey('accounts.Team', on_delete=models.SET_NULL, null=True, blank=True, related_name='scheduled_posts')
    accounts = models.ManyToManyField('social.SocialAccount', related_name='scheduled_posts')
    content = models.TextField()
    content_per_platform = models.JSONField(blank=True, null=True)
    hashtags = models.TextField(blank=True)
    first_comment = models.TextField(blank=True)
    scheduled_at = models.DateTimeField()
    timezone = models.CharField(max_length=50, default='America/Sao_Paulo')
    status = models.CharField(max_length=30, default='draft')
    published_at = models.DateTimeField(null=True, blank=True)
    retry_count = models.IntegerField(default=0)
    error_message = models.TextField(blank=True)
    ai_generated = models.BooleanField(default=False)
    ai_prompt = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-scheduled_at']

    def __str__(self) -> str:
        return f'ScheduledPost {self.id} scheduled for {self.scheduled_at}'


class PostMedia(models.Model):
    """Mídias associadas a um post agendado."""

    post = models.ForeignKey(ScheduledPost, on_delete=models.CASCADE, related_name='media')
    file = models.FileField(upload_to='post_media/', blank=True, null=True)
    media_type = models.CharField(max_length=50, blank=True)
    original_filename = models.CharField(max_length=255, blank=True)
    file_size = models.BigIntegerField(default=0)
    width = models.IntegerField(null=True, blank=True)
    height = models.IntegerField(null=True, blank=True)
    duration_seconds = models.FloatField(null=True, blank=True)
    thumbnail = models.ImageField(upload_to='capas_dos_post/', blank=True, null=True)
    alt_text = models.CharField(max_length=255, blank=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self) -> str:
        return f'PostMedia {self.media_type} for post {self.post_id}'


class PublicationResult(models.Model):
    """Resultado do envio de um post para uma conta social."""

    post = models.ForeignKey(ScheduledPost, on_delete=models.CASCADE, related_name='publication_results')
    account = models.ForeignKey('social.SocialAccount', on_delete=models.CASCADE, related_name='publication_results')
    platform_post_id = models.CharField(max_length=200, blank=True)
    platform_post_url = models.URLField(blank=True)
    status = models.CharField(max_length=30, default='pending')
    error_code = models.CharField(max_length=100, blank=True)
    error_message = models.TextField(blank=True)
    response = models.JSONField(blank=True, null=True)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f'PublicationResult {self.status} for post {self.post_id}'
