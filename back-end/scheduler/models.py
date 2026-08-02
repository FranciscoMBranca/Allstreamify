from django.db import models


class ScheduledPost(models.Model):
    """Post agendado para distribuição em plataformas."""

    title = models.CharField(max_length=200)
    body = models.TextField()
    publish_at = models.DateTimeField()
    status = models.CharField(max_length=30, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.title
