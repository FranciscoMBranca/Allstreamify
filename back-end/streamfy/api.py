from html import parser as parse

import ninja
from ninja.parser import Parser
from django.http import HttpResponse
import orjson

class ORJSONParser(Parser):
    media_type = "application/json"

    def parse(self, request: HttpResponse):
        try:
            return orjson.loads(request.body)
        except orjson.JSONDecodeError as e:
            raise parse.ParseError(f"JSON parse error - {str(e)}")


Api = ninja.NinjaAPI(parser=ORJSONParser, title="Streamfy API", version="0.1.0")


@Api.get("/ola")
def hello(request): 
    return {"message": "Hello, World!"}