import random

from myapp.models import TarotCard


TOPIC_FIELDS = {
    "ทั่วไป": "meaning",
    "ความรัก": "advice_love",
    "การเรียน": "advice_study",
    "การงาน": "advice_work",
    "ชีวิต": "advice_life",
    "สุขภาพ": "advice_health",
}


def draw_random_tarot_card():
    cards = list(TarotCard.objects.all().order_by("id"))
    if not cards:
        return None
    return random.choice(cards)


def get_tarot_result(topic="ทั่วไป"):
    card = draw_random_tarot_card()
    if card is None:
        return None

    field_name = TOPIC_FIELDS.get(topic, "meaning")
    advice_text = getattr(card, field_name, "") or card.meaning

    return {
        "topic": topic,
        "card": card,
        "advice_text": advice_text,
    }


def build_tarot_reply(result):
    if result is None:
        return "ตอนนี้ยังไม่มีข้อมูลไพ่ในระบบครับ"

    card = result["card"]
    topic = result["topic"]
    advice_text = result["advice_text"]

    if topic == "ทั่วไป":
        return (
            "ข้อความโดยรวม\n\n"
            f"{card.meaning}\n\n"
            "Card Interpretations\n"
            "การตีความไพ่\n\n"
            f"ไพ่ 1: {card.name_th}\n"
            f"{card.name}: {advice_text}"
        )

    return (
        f"ข้อความโดยรวมด้าน{topic}\n\n"
        f"{advice_text}\n\n"
        "Card Interpretations\n"
        "การตีความไพ่\n\n"
        f"ไพ่ 1: {card.name_th}\n"
        f"{card.name}: {advice_text}"
    )
