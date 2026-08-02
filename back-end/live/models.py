from django.db import models


class LiveRoom(models.Model):
    """Sala de transmissão ao vivo."""

    name = models.CharField(max_length=160)
    status = models.CharField(max_length=30, default="idle")
    started_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.name
