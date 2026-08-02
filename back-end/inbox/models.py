from django.contrib.auth.models import User
from django.db import models


class InboxMessage(models.Model):
    """Mensagem recebida de uma conta social conectada."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='inbox_messages')
    account = models.ForeignKey('social.SocialAccount', on_delete=models.SET_NULL, null=True, blank=True, related_name='inbox_messages')
    platform_message_id = models.CharField(max_length=150, unique=True)
    message_type = models.CharField(max_length=30, default='dm')
    sender_platform_id = models.CharField(max_length=150, blank=True)
    sender_username = models.CharField(max_length=100, blank=True)
    sender_display_name = models.CharField(max_length=150, blank=True)
    sender_avatar_url = models.URLField(blank=True)
    content = models.TextField()
    media_url = models.URLField(blank=True)
    is_read = models.BooleanField(default=False)
    is_replied = models.BooleanField(default=False)
    auto_replied = models.BooleanField(default=False)
    is_hidden = models.BooleanField(default=False)
    sentiment = models.CharField(max_length=20, blank=True)
    language = models.CharField(max_length=10, blank=True)
    received_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f'InboxMessage from {self.sender_username or self.sender_platform_id or self.platform_message_id}'


class InboxReply(models.Model):
    """Resposta gerada para uma mensagem de inbox."""

    message = models.ForeignKey(InboxMessage, on_delete=models.CASCADE, related_name='replies')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='inbox_replies')
    reply_text = models.TextField()
    replied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f'InboxReply by {self.user.username}'


class AutoReplyRule(models.Model):
    """Regra de resposta automática de mensagens."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='auto_reply_rules')
    name = models.CharField(max_length=120)
    applies_to = models.CharField(max_length=30, default='dm')
    trigger_type = models.CharField(max_length=30, default='keyword')
    trigger_keywords = models.TextField(blank=True)
    reply_mode = models.CharField(max_length=30, default='fixed')
    fixed_reply = models.TextField(blank=True)
    ai_instructions = models.TextField(blank=True)
    ai_tone = models.CharField(max_length=30, blank=True)
    max_per_hour = models.IntegerField(default=0)
    max_per_day = models.IntegerField(default=0)
    active_hours_start = models.IntegerField(default=0)
    active_hours_end = models.IntegerField(default=23)
    is_active = models.BooleanField(default=True)
    reply_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f'AutoReplyRule {self.name}'
