from datetime import timedelta

from django.db.models import Count
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response

from myapp.api.auth_utils import admin_login_required
from myapp.models import DifyRequestLog, SystemEventLog, User, UserMessage


THAI_MONTHS = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
]
ZODIAC_ORDER = [
    "เมษ", "พฤษภ", "เมถุน", "กรกฎ", "สิงห์", "กันย์",
    "ตุลย์", "พิจิก", "ธนู", "มังกร", "กุมภ์", "มีน",
]



def format_thai_day(day):
    return f"{day.day} {THAI_MONTHS[day.month - 1]}"


def calculate_percent(count, total):
    if total == 0:
        return 0
    return round((count / total) * 100, 1)


@api_view(["GET"])
@admin_login_required
def overview(request):
    today = timezone.localdate()
    total_users = User.objects.count()

    complete_profiles = User.objects.filter(step__gte=2).count()
    incomplete_profiles = User.objects.filter(step__lt=2).count()

    questions_today = UserMessage.objects.filter(created_at__date=today).count()
    dify_requests_today = DifyRequestLog.objects.filter(created_at__date=today).count()

    success_count = DifyRequestLog.objects.filter(status="success").count()
    total_dify = DifyRequestLog.objects.count()
    success_rate = calculate_percent(success_count, total_dify)


    message_trend = []
    start_date = today - timedelta(days=6)

    for i in range(7):
        day = start_date + timedelta(days=i)
        count = UserMessage.objects.filter(created_at__date=day).count()

        message_trend.append({
            "label": format_thai_day(day),
            "value": count,
        })

    profile_completion = [
        {
            "label": "สมบูรณ์",
            "value": calculate_percent(complete_profiles, total_users),
        },
        {
            "label": "ไม่สมบูรณ์",
            "value": calculate_percent(incomplete_profiles, total_users),
        },
    ]

    male_count = User.objects.filter(gender="ชาย").count()
    female_count = User.objects.filter(gender="หญิง").count()
    other_count = User.objects.exclude(gender__in=["ชาย", "หญิง"]).count()

    gender_distribution = [
        {
            "label": "ชาย",
            "value": calculate_percent(male_count, total_users),
        },
        {
            "label": "หญิง",
            "value": calculate_percent(female_count, total_users),
        },
        {
            "label": "อื่นๆ",
            "value": calculate_percent(other_count, total_users),
        },
    ]

    top_provinces = list(
        User.objects.exclude(birth_place="")
        .values("birth_place")
        .annotate(value=Count("id"))
        .order_by("-value")[:5]
    )

    top_provinces = [
        {
            "label": item["birth_place"],
            "value": item["value"],
        }
        for item in top_provinces
    ]

    

    zodiac_counts = {
    item["zodiac_sign"]: item["value"]
    for item in User.objects.exclude(zodiac_sign="")
    .values("zodiac_sign")
    .annotate(value=Count("id"))
}
    zodiac_distribution = [
    {
        "label": zodiac,
        "value": zodiac_counts.get(zodiac, 0),
    }
    for zodiac in ZODIAC_ORDER
]


    
    recent_activities = list(
        SystemEventLog.objects.order_by("-created_at")
        .values("title", "created_at")[:6]
    )

    data = {
        "summary": {
            "total_users": total_users,
            "complete_profiles": complete_profiles,
            "incomplete_profiles": incomplete_profiles,
            "questions_today": questions_today,
            "dify_requests_today": dify_requests_today,
            "success_rate": success_rate,
        },
        "message_trend": message_trend,
        "profile_completion": profile_completion,
        "gender_distribution": gender_distribution,
        "top_provinces": top_provinces,
        "zodiac_distribution": zodiac_distribution,
        "recent_activities": recent_activities,
    }

    return Response(data)
