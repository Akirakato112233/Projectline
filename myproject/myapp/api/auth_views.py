import json
import os

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

SESSION_AUTH_KEY = "dashboard_authenticated"
SESSION_USER_NAME_KEY = "dashboard_user_name"


def build_user_payload(name=None):
    return {
        "username": "dashboard",
        "name": name or os.getenv("DASHBOARD_DISPLAY_NAME", "Admin"),
        "role": "ผู้ดูแลระบบ",
        "is_staff": True,
        "is_superuser": False,
    }


def parse_request_body(request):
    if not request.body:
        return {}

    try:
        return json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return {}


@csrf_exempt
@require_POST
def admin_login(request):
    payload = parse_request_body(request)
    password = payload.get("password", "")
    shared_password = os.getenv("DASHBOARD_PASSWORD", "123")

    if not shared_password or password != shared_password:
        return JsonResponse({"message": "รหัสผ่านไม่ถูกต้อง"}, status=400)

    display_name = os.getenv("DASHBOARD_DISPLAY_NAME", "Admin")
    request.session[SESSION_AUTH_KEY] = True
    request.session[SESSION_USER_NAME_KEY] = display_name
    request.session.modified = True

    return JsonResponse({"user": build_user_payload(display_name)})


@csrf_exempt
@require_POST
def admin_logout(request):
    request.session.flush()
    return JsonResponse({"message": "ออกจากระบบเรียบร้อยแล้ว"})


@require_GET
def admin_me(request):
    if not request.session.get(SESSION_AUTH_KEY):
        return JsonResponse({"user": None})

    display_name = request.session.get(SESSION_USER_NAME_KEY)
    return JsonResponse({"user": build_user_payload(display_name)})
