from django.db.models import Count
from rest_framework.decorators import api_view
from rest_framework.response import Response

from myapp.api.auth_utils import admin_login_required
from myapp.models import User


ZODIAC_ORDER = [
    "เมษ", "พฤษภ", "เมถุน", "กรกฎ", "สิงห์", "กันย์",
    "ตุลย์", "พิจิก", "ธนู", "มังกร", "กุมภ์", "มีน",
]


def calculate_percent(count, total):
    if total == 0:
        return 0
    return round((count / total) * 100, 1)


def build_distribution(counts):
    return [
        {
            "label": zodiac,
            "value": counts.get(zodiac, 0),
        }
        for zodiac in ZODIAC_ORDER
    ]


@api_view(["GET"])
@admin_login_required
def astrology_overview(request):
    total_users = User.objects.count()

    zodiac_counts = {
        item["zodiac_sign"]: item["value"]
        for item in User.objects.exclude(zodiac_sign="")
        .values("zodiac_sign")
        .annotate(value=Count("id"))
    }

    ascendant_counts = {zodiac: 0 for zodiac in ZODIAC_ORDER}
    users_with_star_positions = 0

    for star_positions in User.objects.values_list("star_positions", flat=True):
        if not star_positions:
            continue

        users_with_star_positions += 1
        ascendant = star_positions.get("Ascendant")
        if ascendant in ascendant_counts:
            ascendant_counts[ascendant] += 1

    zodiac_distribution = build_distribution(zodiac_counts)
    ascendant_distribution = build_distribution(ascendant_counts)

    zodiac_details = [
        {
            "label": item["label"],
            "value": item["value"],
            "percent": calculate_percent(item["value"], total_users),
        }
        for item in zodiac_distribution
    ]

    data = {
        "stats": {
            "zodiac_count": len([value for value in zodiac_counts.values() if value > 0]),
            "ascendant_count": len([value for value in ascendant_counts.values() if value > 0]),
            "star_position_percent": calculate_percent(users_with_star_positions, total_users),
        },
        "zodiac_distribution": zodiac_distribution,
        "ascendant_distribution": ascendant_distribution,
        "zodiac_details": zodiac_details,
    }

    return Response(data)
