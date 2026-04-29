from collections import Counter
from datetime import timedelta

from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response

from myapp.api.auth_utils import admin_login_required
from myapp.models import SystemEventLog, TarotCard


THAI_MONTHS = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
]


def format_thai_day(day):
    return f"{day.day} {THAI_MONTHS[day.month - 1]}"


def parse_detail(detail):
    parsed = {}
    for chunk in (detail or "").split(","):
        if "=" not in chunk:
            continue
        key, value = chunk.split("=", 1)
        parsed[key.strip()] = value.strip()
    return parsed


def build_ranked_items(counter, limit=5):
    return [
        {"label": label, "value": value}
        for label, value in counter.most_common(limit)
    ]


@api_view(["GET"])
@admin_login_required
def tarot_overview(request):
    tarot_logs = SystemEventLog.objects.filter(event_type="line_tarot_reply_success").order_by("-created_at")
    total_draws = tarot_logs.count()
    total_cards = TarotCard.objects.count()

    topic_counter = Counter()
    card_counter = Counter()
    user_ids = set()
    daily_counter = Counter()

    for log in tarot_logs:
        detail = parse_detail(log.detail)
        topic = detail.get("topic")
        card_name = detail.get("card_name_th")
        user_id = detail.get("user_id")

        if topic:
            topic_counter[topic] += 1
        if card_name:
            card_counter[card_name] += 1
        if user_id:
            user_ids.add(user_id)

        local_day = timezone.localtime(log.created_at).date()
        daily_counter[local_day] += 1

    today = timezone.localdate()
    draw_trend = []

    for offset in range(6, -1, -1):
        day = today - timedelta(days=offset)
        draw_trend.append({
            "label": format_thai_day(day),
            "value": daily_counter.get(day, 0),
        })

    recent_draws = []
    for log in tarot_logs[:8]:
        detail = parse_detail(log.detail)
        recent_draws.append({
            "topic": detail.get("topic", "-"),
            "card_name_th": detail.get("card_name_th", "-"),
            "created_at": timezone.localtime(log.created_at).strftime("%d/%m/%Y %H:%M"),
        })

    data = {
        "summary": {
            "total_draws": total_draws,
            "unique_users": len(user_ids),
            "unique_cards_drawn": len(card_counter),
            "total_cards_in_system": total_cards,
        },
        "top_topics": build_ranked_items(topic_counter),
        "top_cards": build_ranked_items(card_counter),
        "draw_trend": draw_trend,
        "recent_draws": recent_draws,
    }

    return Response(data)
