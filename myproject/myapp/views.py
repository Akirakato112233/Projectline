from .api.line_views import get_configuration, get_handler, webhook
from .models import ZodiacKnowledge


def extract_subject_and_category(message_text):
    parts = message_text.strip().split(maxsplit=1)
    if len(parts) != 2:
        return None, None

    return parts[0], parts[1]


def build_zodiac_reply(message_text):
    subject, category = extract_subject_and_category(message_text)
    if not subject or not category:
        return "พิมพ์แบบนี้ได้เลย: ราศีเมษ โชคลาภ"

    knowledge = ZodiacKnowledge.objects.filter(
        subject=subject,
        category=category,
    ).first()

    if knowledge is None:
        return "พิมพ์แบบนี้ได้เลย: ราศีเมษ โชคลาภ"

    return f"{subject} {category}\n{knowledge.content}"
