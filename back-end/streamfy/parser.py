from django.http import HttpRequest
from ninja.parser import Parser
from typing import Any
import json

try:
    import orjson
except ModuleNotFoundError:  # pragma: no cover - fallback when optional dep not installed
    orjson = None


# Cada chamada do frontend passa por este parser. Ele converte o request em JSON e
# torna a API mais rápida e previsível para os endpoints que devolvem dados em React


class ORJSONParser(Parser):
    """Parser JSON com fallback para json nativo quando o orjson não está instalado."""

    media_type = "application/json"

    def parse_body(self, request: HttpRequest) -> dict[str, Any]:
        try:
            body = request.body or b'{}'
            if not body.strip():
                return {}
            if orjson is not None:
                payload = orjson.loads(body)
            else:
                payload = json.loads(body.decode('utf-8'))
            if isinstance(payload, dict):
                return payload
            return {'value': payload}
        except (TypeError, ValueError, UnicodeDecodeError):
            try:
                return json.loads(request.body.decode('utf-8'))
            except (TypeError, ValueError, UnicodeDecodeError):
                return {}

    def parse_querydict(self, data, list_fields, request):
        result = {}
        for key in data.keys():
            if key in list_fields:
                result[key] = data.getlist(key)
            else:
                result[key] = data.get(key)
        return result
