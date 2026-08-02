from django.db import models


class AIGenerationLog(models.Model):
    """Registo simples de geração de conteúdo com IA."""

    prompt = models.TextField()
    result = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.prompt[:60]
