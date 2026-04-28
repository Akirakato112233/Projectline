from datetime import datetime

from rest_framework.decorators import api_view
from rest_framework.response import Response

from myapp.api.auth_utils import admin_login_required
from myapp.api.serializers import UserSerializer
from myapp.models import User
from myapp.services import (
    calculate_star_positions,
    calculate_with_ascendant,
    get_smart_lat_lon,
    get_smart_province,
)


def get_missing_fields(user):
    missing = []

    if not user.full_name:
        missing.append("ชื่อ")
    if not user.birth_date:
        missing.append("วันเกิด")
    if not user.birth_time:
        missing.append("เวลา")
    if not user.birth_place:
        missing.append("จังหวัด")
    if not user.gender:
        missing.append("เพศ")

    return missing
def get_completion(user):
    total_fields = 5
    filled_fields = 0

    if user.full_name:
        filled_fields += 1
    if user.birth_date:
        filled_fields += 1
    if user.birth_time:
        filled_fields += 1
    if user.birth_place:
        filled_fields += 1
    if user.gender:
        filled_fields += 1

    return int((filled_fields / total_fields) * 100)

def finalize_liff_profile(user):
    is_complete = all([
        user.full_name,
        user.birth_date,
        user.birth_time,
        user.birth_place,
        user.gender,
    ])

    if not is_complete:
        user.step = 0
        user.zodiac_sign = ""
        user.star_positions = None
        return

    stars = calculate_star_positions(user.birth_date, user.birth_time)
    lat, lon = get_smart_lat_lon(user.birth_place)
    ascendant_sign = calculate_with_ascendant(user.birth_date, user.birth_time, lat, lon)

    stars["Ascendant"] = ascendant_sign
    user.star_positions = stars
    user.zodiac_sign = stars.get("Sun", "")
    user.step = 2

@api_view(["GET"])
@admin_login_required
def user_list(request):
    users = User.objects.all().order_by("-created_at")
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@admin_login_required
def incomplete_user_list(request):
    users = User.objects.filter(step__lt=2).order_by("-created_at")

    data = []
    for user in users:
        data.append({
            "id": user.id,
            "line_user_id": user.line_user_id,
            "full_name": user.full_name,
            "birth_place": user.birth_place,
            "gender": user.gender,
            "missing_fields": get_missing_fields(user),
            "completion": get_completion(user),
            "created_at": user.created_at,
        })

    return Response(data)

@api_view(["GET", "POST"])
def liff_user_profile(request):
    if request.method == "GET":
        line_user_id = request.GET.get("line_user_id", "").strip()

        if not line_user_id:
            return Response({"message": "line_user_id is required"}, status=400)

        try:
            user = User.objects.get(line_user_id=line_user_id)
        except User.DoesNotExist:
            return Response({"message": "User not found"}, status=404)

        serializer = UserSerializer(user)
        return Response(serializer.data)

    line_user_id = request.data.get("line_user_id", "").strip()

    if not line_user_id:
        return Response({"message": "line_user_id is required"}, status=400)

    user, created = User.objects.get_or_create(line_user_id=line_user_id)

    user.full_name = request.data.get("full_name", "").strip()

    birth_place = request.data.get("birth_place", "").strip()
    user.birth_place = get_smart_province(birth_place) if birth_place else ""

    user.gender = request.data.get("gender", "").strip()

    birth_date = request.data.get("birth_date", "").strip()
    birth_time = request.data.get("birth_time", "").strip()

    try:
        user.birth_date = datetime.strptime(birth_date, "%Y-%m-%d").date() if birth_date else None
        user.birth_time = datetime.strptime(birth_time, "%H:%M").time() if birth_time else None

        finalize_liff_profile(user)
        user.save()
    except ValueError:
        return Response({"message": "Invalid birth date or birth time"}, status=400)
    except Exception as error:
        return Response({"message": str(error)}, status=400)

    serializer = UserSerializer(user)
    return Response(serializer.data, status=201 if created else 200)
