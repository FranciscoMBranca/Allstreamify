from django.db import models


class PlatformMetric(models.Model):
    """Métricas agregadas por plataforma e intervalo de tempo."""

    platform = models.CharField(max_length=50)
    range_name = models.CharField(max_length=20, default='Semana')
    views = models.PositiveIntegerField(default=0)
    likes = models.PositiveIntegerField(default=0)
    comments = models.PositiveIntegerField(default=0)
    engagement = models.PositiveIntegerField(default=0)
    captured_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-captured_at']

    def __str__(self) -> str:
        return f'{self.platform} - {self.engagement} engajamento'


class AccountSnapshot(models.Model):
    """Foto diária das métricas de uma conta social."""

    account = models.ForeignKey('social.SocialAccount', on_delete=models.CASCADE, related_name='snapshots')
    date = models.DateField()
    followers = models.IntegerField(default=0)
    following = models.IntegerField(default=0)
    posts_count = models.IntegerField(default=0)
    reach = models.IntegerField(default=0)
    impressions = models.IntegerField(default=0)
    profile_views = models.IntegerField(default=0)
    website_clicks = models.IntegerField(default=0)
    avg_likes_7d = models.FloatField(default=0)
    avg_comments_7d = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']
        unique_together = ('account', 'date')

    def __str__(self) -> str:
        return f'AccountSnapshot {self.account.platform}:{self.account.username} @ {self.date}'


class PostMetrics(models.Model):
    """Métricas individuais de publicações por conta social."""

    account = models.ForeignKey('social.SocialAccount', on_delete=models.CASCADE, related_name='post_metrics')
    post_id = models.CharField(max_length=200)
    likes = models.IntegerField(default=0)
    comments = models.IntegerField(default=0)
    shares = models.IntegerField(default=0)
    reach = models.IntegerField(default=0)
    impressions = models.IntegerField(default=0)
    engagement_rate = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f'PostMetrics {self.account.platform}:{self.post_id}'
