from typing import Any


def _pick_value(payload: dict[str, Any], *keys: str) -> Any:
    """Retorna o primeiro valor presente entre as chaves fornecidas."""
    for key in keys:
        value = payload.get(key)
        if value not in (None, ''):
            return value
    return None


def normalize_twitch_payload(payload: dict[str, Any]) -> dict[str, Any]:
    """Normaliza os dados recebidos para uma conta da Twitch."""
    normalized = {
        'platform_user_id': _pick_value(payload, 'platformUserId', 'platform_user_id', 'userId', 'id'),
        'username': _pick_value(payload, 'username', 'login', 'displayName') or 'twitch_user',
        'display_name': _pick_value(payload, 'displayName', 'name', 'login', 'username') or '',
        'avatar_url': payload.get('avatarUrl', ''),
        'access_token': payload.get('accessToken', ''),
        'refresh_token': payload.get('refreshToken', ''),
        'followers_count': int(payload.get('followersCount', 0) or 0),
        'following_count': int(payload.get('followingCount', 0) or 0),
        'posts_count': int(payload.get('postsCount', 0) or 0),
        'bio': payload.get('bio', ''),
        'scopes': payload.get('scopes', ''),
    }

    if not normalized['platform_user_id']:
        raise ValueError('Twitch payload deve conter platformUserId, platform_user_id, userId ou id.')

    return normalized
