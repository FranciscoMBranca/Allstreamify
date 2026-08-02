from django.db import models


class UserProfile(models.Model):
    """Perfil simples do usuário para o módulo de contas."""

    name = models.CharField(max_length=120)
    email = models.EmailField(unique=True)
    plan = models.CharField(max_length=40, default="free")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "perfil"
        verbose_name_plural = "perfis"

    def __str__(self) -> str:
        return self.name


class Team(models.Model):
    """Equipe associada a um perfil."""

    name = models.CharField(max_length=120)
    owner = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="teams")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.name
