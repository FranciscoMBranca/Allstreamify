from typing import Any


def normalize_facebook_payload(payload: dict[str, Any]) -> dict[str, Any]:
    """Normaliza o payload recebido para uma conexão Facebook no backend."""
    normalized = {
        'platform_user_id': payload.get('platformUserId')
        or payload.get('platform_user_id')
        or payload.get('pageId')
        or payload.get('id'),
        'username': payload.get('username')
        or payload.get('displayName')
        or payload.get('pageName')
        or payload.get('name')
        or 'facebook_user',
        'display_name': payload.get('displayName')
        or payload.get('pageName')
        or payload.get('name')
        or payload.get('username', ''),
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
        raise ValueError('Facebook payload deve conter platformUserId, platform_user_id, pageId ou id.')

    return normalized
