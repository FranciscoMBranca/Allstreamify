from django.db import models


class PostMetrics(models.Model):
    """Métricas de desempenho do conteúdo publicado."""

    platform = models.CharField(max_length=50)
    views = models.PositiveIntegerField(default=0)
    likes = models.PositiveIntegerField(default=0)
    comments = models.PositiveIntegerField(default=0)
    captured_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.platform} - {self.views} views"
