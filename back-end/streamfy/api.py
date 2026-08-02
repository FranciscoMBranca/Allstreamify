from __future__ import annotations

from html import parser as parse
from typing import Any

import ninja
import orjson
from django.http import HttpResponse
from ninja.parser import Parser


class ORJSONParser(Parser):
    """Parser JSON com suporte a orjson para respostas rápidas e legíveis."""

    media_type = "application/json"

    def parse(self, request: HttpResponse):
        try:
            return orjson.loads(request.body)
        except orjson.JSONDecodeError as exc:
            raise parse.ParseError(f"JSON parse error - {str(exc)}")


Api = ninja.NinjaAPI(
    parser=ORJSONParser,
    title="Streamfy API",
    version="0.1.0",
    description="API do painel Streamify para gestão de plataformas sociais e transmissão.",
)


PLATFORMS = [
    {
        "id": "youtube",
        "name": "YouTube",
        "title": "YouTube",
        "description": "Transmita para o seu canal com qualidade profissional e controle de audiência.",
        "icon": "https://api.iconify.design/mdi:youtube.svg?color=%23FF0000",
        "category": "video",
    },
    {
        "id": "linkedin",
        "name": "LinkedIn",
        "title": "LinkedIn",
        "description": "Conecte o seu perfil ou página para reforçar marcas e eventos profissionais.",
        "icon": "https://api.iconify.design/mdi:linkedin.svg?color=%230A66C2",
        "category": "network",
    },
    {
        "id": "twitch",
        "name": "Twitch",
        "title": "Twitch",
        "description": "Acompanhe o chat, a comunidade e o desempenho das suas transmissões.",
        "icon": "https://api.iconify.design/mdi:twitch.svg?color=%239146FF",
        "category": "live",
    },
]


def build_dashboard_payload() -> dict[str, Any]:
    """Montagem de dados iniciais do painel para o front-end."""
    return {
        "summary": {
            "connectedPlatforms": 2,
            "activeStreams": 1,
            "audience": 18420,
            "nextEvent": "20:00",
        },
        "platforms": [
            {
                **platform,
                "isConnected": platform["id"] in {"youtube", "twitch"},
                "accountInfo": {
                    "username": f"streamer_{platform['id']}",
                    "followers": 12000 + (len(platform["id"]) * 700),
                    "connectedAt": "2026-08-01T10:30:00Z",
                }
                if platform["id"] in {"youtube", "twitch"}
                else None,
            }
            for platform in PLATFORMS
        ],
        "highlights": [
            {
                "title": "Transmissão multistream",
                "description": "Conecte diferentes plataformas e mantenha o conteúdo em sincronização.",
                "tag": "Ao vivo",
            },
            {
                "title": "Painel de produção",
                "description": "Gerencie cenas, áudio e convidados com uma visão simples e clara.",
                "tag": "Novo",
            },
        ],
    }


@Api.get("/health")
def health(request):
    """Endpoint simples para validar se a API está disponível."""
    return {"status": "ok", "service": "streamfy"}


@Api.get("/dashboard")
def dashboard(request):
    """Retorna os dados de exemplo usados pelo painel principal."""
    return build_dashboard_payload()


@Api.get("/platforms")
def platforms(request):
    """Lista as plataformas sociais simuladas pelo produto."""
    return {"platforms": PLATFORMS}


@Api.post("/platforms/connect")
def connect_platform(request, payload: dict[str, Any]):
    """Simula a conexão de uma plataforma com payload simples."""
    platform_id = payload.get("platformId")
    if not platform_id:
        return {"success": False, "message": "platformId é obrigatório."}, 400

    platform = next((item for item in PLATFORMS if item["id"] == platform_id), None)
    if not platform:
        return {"success": False, "message": "Plataforma não encontrada."}, 404

    return {
        "success": True,
        "message": f"{platform['name']} conectada com sucesso.",
        "platform": platform_id,
    }
