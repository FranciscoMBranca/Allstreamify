from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class Plan(models.Model):
    """Plano de assinatura disponível no sistema."""

    name = models.CharField(max_length=50)
    slug = models.SlugField(unique=True)
    stripe_price_id = models.CharField(max_length=100, blank=True)
    price_monthly = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    price_yearly = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    max_social_accounts = models.IntegerField(default=1)
    max_scheduled_posts = models.IntegerField(default=10)
    max_team_members = models.IntegerField(default=1)
    storage_gb = models.IntegerField(default=1)
    has_ai_features = models.BooleanField(default=False)
    has_analytics = models.BooleanField(default=False)
    has_live_streaming = models.BooleanField(default=False)
    has_auto_reply = models.BooleanField(default=False)
    has_api_access = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['price_monthly']
        verbose_name = 'plano'
        verbose_name_plural = 'planos'

    def __str__(self) -> str:
        return f'{self.name} (R${self.price_monthly}/mês)'


class UserProfile(models.Model):
    """Perfil do usuário com dados de negócio e associação ao Clerk."""

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    clerk_user_id = models.CharField(max_length=100, unique=True, blank=True)
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True)
    website = models.URLField(blank=True)
    timezone = models.CharField(max_length=50, default='Africa/Luanda')
    language = models.CharField(max_length=10, default='pt-br')
    plan = models.ForeignKey(Plan, on_delete=models.SET_NULL, null=True, blank=True, related_name='subscribers')
    plan_expires_at = models.DateTimeField(null=True, blank=True)
    stripe_customer_id = models.CharField(max_length=100, blank=True)
    email_verified = models.BooleanField(default=False)
    two_factor_enabled = models.BooleanField(default=False)
    onboarding_done = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'perfil de usuário'
        verbose_name_plural = 'perfis de usuário'

    def __str__(self) -> str:
        return self.user.get_full_name() or self.user.username

    @property
    def full_name(self):
        return f'{self.user.first_name} {self.user.last_name}'.strip() or self.user.username

    @property
    def is_plan_active(self):
        from django.utils import timezone

        if not self.plan:
            return False
        if not self.plan_expires_at:
            return True
        return self.plan_expires_at > timezone.now()


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        free_plan = Plan.objects.filter(slug='free').first()
        UserProfile.objects.create(user=instance, plan=free_plan)


class Team(models.Model):
    """Equipe ou agência que agrupa usuários e contas sociais."""

    name = models.CharField(max_length=120)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='team_avatars/', blank=True, null=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_teams')
    plan = models.ForeignKey(Plan, on_delete=models.SET_NULL, null=True, blank=True, related_name='teams')
    plan_expires_at = models.DateTimeField(null=True, blank=True)
    members = models.ManyToManyField(
        User,
        through='TeamMembership',
        through_fields=('team', 'user'),
        related_name='teams',
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'equipe'
        verbose_name_plural = 'equipes'

    def __str__(self) -> str:
        return self.name


class TeamMembership(models.Model):
    """Associação de usuário a uma equipe com papel e convite."""

    ROLE_CHOICES = [
        ('owner', 'Owner'),
        ('admin', 'Admin'),
        ('editor', 'Editor'),
        ('viewer', 'Viewer'),
    ]

    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='memberships')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='team_memberships')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='viewer')
    invited_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='team_invitations')
    invite_accepted = models.BooleanField(default=False)
    invite_token = models.UUIDField(unique=True, null=True, blank=True)
    joined_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('team', 'user')
        verbose_name = 'membro da equipe'
        verbose_name_plural = 'membros da equipe'

    def __str__(self) -> str:
        return f'{self.user.username} in {self.team.name} ({self.role})'


class Notification(models.Model):
    """Notificações internas do sistema para o usuário."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f'Notification for {self.user.username}: {self.title}'


class AuditLog(models.Model):
    """Registro de ações importantes do usuário para auditoria."""

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='audit_logs')
    action = models.CharField(max_length=200)
    ip_address = models.CharField(max_length=45, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f'{self.user.username if self.user else "system"} - {self.action}'


class Subscription(models.Model):
    """Assinatura ativa de um usuário para um plano."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    plan = models.ForeignKey(Plan, on_delete=models.SET_NULL, null=True, related_name='subscriptions')
    stripe_subscription_id = models.CharField(max_length=150, blank=True)
    status = models.CharField(max_length=50, default='active')
    current_period_start = models.DateTimeField(null=True, blank=True)
    current_period_end = models.DateTimeField(null=True, blank=True)
    cancel_at_period_end = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f'Subscription {self.user.username} - {self.plan.name if self.plan else "none"}'
