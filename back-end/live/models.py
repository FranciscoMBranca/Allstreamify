from django.contrib.auth.models import User
from django.db import models


class LiveRoom(models.Model):
    """Sala de transmissão ao vivo ou reunião."""

    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name='live_rooms')
    room_code = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=200)
    room_type = models.CharField(max_length=30, default='live')
    status = models.CharField(max_length=30, default='scheduled')
    max_participants = models.IntegerField(default=50)
    is_private = models.BooleanField(default=False)
    password = models.CharField(max_length=100, blank=True)
    recording_enabled = models.BooleanField(default=False)
    recording_url = models.URLField(blank=True)
    agora_channel = models.CharField(max_length=150, blank=True)
    scheduled_at = models.DateTimeField(null=True, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-scheduled_at']

    def __str__(self) -> str:
        return f'LiveRoom {self.title} ({self.room_code})'


class LiveParticipant(models.Model):
    """Participante de uma sala de live."""

    room = models.ForeignKey(LiveRoom, on_delete=models.CASCADE, related_name='participants')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='live_participations')
    joined_at = models.DateTimeField(auto_now_add=True)
    left_at = models.DateTimeField(null=True, blank=True)
    is_host = models.BooleanField(default=False)

    class Meta:
        unique_together = ('room', 'user')

    def __str__(self) -> str:
        return f'LiveParticipant {self.user.username} in {self.room.room_code}'
