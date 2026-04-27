import requests
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response

from myapp.api.auth_utils import admin_login_required
from myapp.app_settings import get_setting


def build_ok(title, detail):
    return {
        "title": title,
        "status": "ok",
        "detail": detail,
    }


def build_error(title, detail):
    return {
        "title": title,
        "status": "error",
        "detail": detail,
    }


def get_dify_endpoint():
    base_url = get_setting("dify_api_url", "https://api.dify.ai/v1")
    if base_url.endswith("/chat-messages"):
        return base_url
    return f"{base_url.rstrip('/')}/chat-messages"


def check_django_backend():
    return build_ok("Django Backend", "Server running")


def check_line_api():
    if not settings.LINE_CHANNEL_ACCESS_TOKEN:
        return build_error("LINE Webhook", "LINE_CHANNEL_ACCESS_TOKEN is not configured")

    try:
        response = requests.get(
            "https://api.line.me/v2/bot/info",
            headers={"Authorization": f"Bearer {settings.LINE_CHANNEL_ACCESS_TOKEN}"},
            timeout=5,
        )
    except requests.RequestException as error:
        return build_error("LINE Webhook", f"Connection failed: {error}")

    if response.status_code == 200:
        return build_ok("LINE Webhook", "Connected")

    return build_error("LINE Webhook", f"Status code: {response.status_code}")


def check_dify_api():
    if not settings.DIFY_API_KEY:
        return build_error("Dify API", "DIFY_API_KEY is not configured")

    try:
        response = requests.post(
            get_dify_endpoint(),
            headers={
                "Authorization": f"Bearer {settings.DIFY_API_KEY}",
                "Content-Type": "application/json",
            },
            json={},
            timeout=5,
        )
    except requests.RequestException as error:
        return build_error("Dify API", f"Connection failed: {error}")

    if response.status_code in [200, 400, 422]:
        return build_ok("Dify API", "Connected")
    if response.status_code in [401, 403]:
        return build_error("Dify API", "API key is invalid")

    return build_error("Dify API", f"Status code: {response.status_code}")


@api_view(["GET"])
@admin_login_required
def health_status(request):
    return Response(
        {
            "line_webhook": check_line_api(),
            "dify_api": check_dify_api(),
            "django_backend": check_django_backend(),
        }
    )
