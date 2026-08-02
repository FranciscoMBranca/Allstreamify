from django.db import models


class InboxMessage(models.Model):
    """Mensagem recebida de uma plataforma."""

    sender = models.CharField(max_length=120)
    content = models.TextField()
    received_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.sender
