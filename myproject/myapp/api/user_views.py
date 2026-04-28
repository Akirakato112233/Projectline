from rest_framework.decorators import api_view
from rest_framework.response import Response

from myapp.api.auth_utils import admin_login_required
from myapp.models import User
from myapp.api.serializers import UserSerializer

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

@api_view(["GET"])
def liff_user_profile(request):
    line_user_id = request.GET.get("line_user_id", "").strip()

    if not line_user_id:
        return Response({"message": "line_user_id is required"}, status=400)

    try:
        user = User.objects.get(line_user_id=line_user_id)
    except User.DoesNotExist:
        return Response({"message": "User not found"}, status=404)

    serializer = UserSerializer(user)
    return Response(serializer.data)