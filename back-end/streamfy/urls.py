
from django.contrib import admin
from django.urls import path
from ninja_jwt.authentication import JWTAuth
from .api import Api
from accounts.api import router as accounts_router  
from ai_engine.api import router as ai_router
from analytics.api import router as analytics_router
from inbox.api import router as inbox_router
from live.api import router as live_router
from scheduler.api import router as scheduler_router
from social.api import router as social_router

Api.add_router("/accounts", accounts_router)
Api.add_router("/social", social_router, auth=JWTAuth())
Api.add_router("/scheduler", scheduler_router, auth=JWTAuth())
Api.add_router("/inbox", inbox_router, auth=JWTAuth())
Api.add_router("/analytics", analytics_router, auth=JWTAuth())
Api.add_router("/live", live_router, auth=JWTAuth())
Api.add_router("/ai", ai_router, auth=JWTAuth)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", Api.urls),
]
