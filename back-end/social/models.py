from django.db import models


class SocialAccount(models.Model):
    """Conta conectada a uma rede social."""

    platform = models.CharField(max_length=50)
    username = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    followers = models.PositiveIntegerField(default=0)
    connected_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "conta social"
        verbose_name_plural = "contas sociais"

    def __str__(self) -> str:
        return f"{self.platform}:{self.username}"
