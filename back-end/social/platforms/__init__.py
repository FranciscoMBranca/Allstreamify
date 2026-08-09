from typing import Any, Callable

from .facebook import normalize_facebook_payload
from .instagram import normalize_instagram_payload
from .tiktok import normalize_tiktok_payload
from .twitch import normalize_twitch_payload
from .x import normalize_x_payload
from .youtube import normalize_youtube_payload

PlatformNormalizer = Callable[[dict[str, Any]], dict[str, Any]]

PLATFORM_NORMALIZERS: dict[str, PlatformNormalizer] = {
    'facebook': normalize_facebook_payload,
    'instagram': normalize_instagram_payload,
    'tiktok': normalize_tiktok_payload,
    'twitch': normalize_twitch_payload,
    'x': normalize_x_payload,
    'twitter': normalize_x_payload,
    'youtube': normalize_youtube_payload,
}


def normalize_generic_payload(payload: dict[str, Any]) -> dict[str, Any]:
    return {
        'platform_user_id': payload.get('platformUserId')
        or payload.get('platform_user_id')
        or payload.get('id')
        or payload.get('pageId'),
        'username': payload.get('username')
        or payload.get('displayName')
        or payload.get('name')
        or payload.get('pageName')
        or 'unknown',
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


def get_platform_payload_normalizer(platform_id: str) -> PlatformNormalizer:
    return PLATFORM_NORMALIZERS.get(platform_id.lower(), normalize_generic_payload)
