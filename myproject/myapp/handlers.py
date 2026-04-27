from datetime import datetime
from zoneinfo import ZoneInfo

from .models import User, UserMessage, SystemEventLog
from .api.services import call_dify_astrology
from .services import (
    calculate_star_positions,
    calculate_with_ascendant,
    get_smart_lat_lon,
    get_smart_province,
)


def process_user_message(user_id, message_text):
    user, created = User.objects.get_or_create(line_user_id=user_id)
    message_text = message_text.strip()
    user.last_active_at = datetime.now(ZoneInfo("Asia/Bangkok"))
    user.save(update_fields=["last_active_at"])

    UserMessage.objects.create(
        user=user, 
        message_text=message_text,
        message_type="text",
        )


    if user.step < 2:
        info = extract_data(message_text)
        error_message = update_user_profile_from_info(user, info)
        if error_message:
            return error_message

        if is_profile_complete(user):
            stars = calculate_star_positions(user.birth_date, user.birth_time)
            lat, lon = get_smart_lat_lon(user.birth_place)
            ascendant_sign = calculate_with_ascendant(user.birth_date, user.birth_time, lat, lon)
            stars["Ascendant"] = ascendant_sign
            user.star_positions = stars
            user.zodiac_sign = stars.get("Sun", "")
            user.step = 2
            user.save()
            return f"เรียบร้อยครับคุณ {user.full_name} ทีนี้อยากถามอะไร พิมพ์มาได้เลย!"

        return build_missing_info_message(user)

    now = datetime.now(ZoneInfo("Asia/Bangkok"))
    star_data = {
        "gender": user.gender,
        "zodiac_sign": user.zodiac_sign,
        "star_positions": user.star_positions,
        "current_date": now.strftime("%d/%m/%Y"),
        "current_time": now.strftime("%H:%M"),
    }
    if message_text == "ดูข้อมูลตัวเอง":
        return build_user_profile_message(user)
    elif message_text == "แก้ไขข้อมูล":
        user.step = 0
        user.save()
        return "คุณสามารถส่งข้อมูลใหม่ได้เลยครับ"  
    return call_dify_astrology(                 
        user_query=message_text,
        star_data=star_data,
        user_id=user.line_user_id,
        user=user,
    )


def extract_data(text):
    result = {}

    lines = text.replace("：", ":").split("\n")

    for line in lines:
        if ":" in line:
            parts = line.split(":", 1)
            key = parts[0].strip()
            value = parts[1].strip()

            if "ชื่อ" in key:
                result["name"] = value
            if "เกิด" in key:
                result["date"] = value
            if "เวลา" in key:
                result["time"] = value
            if "เพศ" in key:
                result["gender"] = value
            if "จังหวัด" in key:
                result["place"] = value

    return result


def update_user_profile_from_info(user, info):
    if info.get("name"):
        user.full_name = info["name"]

    if info.get("place"):
        user.birth_place = get_smart_province(info["place"])

    if info.get("gender"):
        user.gender = info["gender"]

    if info.get("date"):
        try:
            user.birth_date = parse_thai_birth_date(info["date"])
        except ValueError:
            user.save()
            return build_invalid_format_message(user, invalid_date=True)

    if info.get("time"):
        try:
            user.birth_time = parse_birth_time(info["time"])
        except ValueError:
            user.save()
            return build_invalid_format_message(user, invalid_time=True)

    user.save()
    return None


def is_profile_complete(user):
    return all([
        user.full_name,
        user.birth_date,
        user.birth_time,
        user.birth_place,
        user.gender,
    ])


def build_missing_info_message(user):
    required_fields = {
        "full_name": "ชื่อ",
        "birth_date": "เกิด",
        "birth_time": "เวลา",
        "birth_place": "จังหวัด",
        "gender": "เพศ",
    }
    missing_fields = [
        label
        for field_name, label in required_fields.items()
        if not getattr(user, field_name)
    ]
    missing_text = ", ".join(missing_fields)

    birth_date = user.birth_date.strftime("%d/%m/%Y") if user.birth_date else "..."
    birth_time = user.birth_time.strftime("%H:%M") if user.birth_time else "..."
    full_name = user.full_name or "..."
    birth_place = user.birth_place or "..."
    gender = user.gender or "..."

    return (
        f"ข้อมูลยังไม่ครบครับ ขาด: {missing_text}\n"
        "กรุณาส่งข้อมูลให้ครบตามรูปแบบนี้ครับเพื่อที่จะได้ทำนายได้ถูกต้อง:\n"
        f"ชื่อ: {full_name}\n"
        f"เกิด: {birth_date}\n"
        f"เวลา: {birth_time}\n"
        f"จังหวัด: {birth_place}\n"
        f"เพศ: {gender}"
    )


def build_invalid_format_message(user, invalid_date=False, invalid_time=False):
    invalid_fields = []
    if invalid_date:
        invalid_fields.append("วันเกิด")
    if invalid_time:
        invalid_fields.append("เวลา")

    invalid_text = " และ ".join(invalid_fields)

    return (
        f"รูปแบบ{invalid_text}ไม่ถูกต้องครับ\n"
        "กรุณาส่งใหม่ตามรูปแบบนี้:\n"
        f"ชื่อ: {user.full_name or '...'}\n"
        f"เกิด: {user.birth_date.strftime('%d/%m/%Y') if user.birth_date else '15/05/2535'}\n"
        f"เวลา: {user.birth_time.strftime('%H:%M') if user.birth_time else '08:30'}\n"
        f"จังหวัด: {user.birth_place or '...'}\n"
        f"เพศ: {user.gender or '...'}"
    )


def build_user_profile_message(user):
    birth_date = user.birth_date.strftime("%d/%m/%Y") if user.birth_date else "-"
    birth_time = user.birth_time.strftime("%H:%M") if user.birth_time else "-"

    return (
        f"ชื่อ: {user.full_name}\n"
        f"เกิด: {birth_date}\n"
        f"เวลา: {birth_time}\n"
        f"จังหวัด: {user.birth_place}\n"
        f"เพศ: {user.gender}\n"
    )


def parse_thai_birth_date(date_text):
    birth_date = datetime.strptime(date_text, "%d/%m/%Y").date()

    if birth_date.year > 2400:
        birth_date = birth_date.replace(year=birth_date.year - 543)

    return birth_date


def parse_birth_time(time_text):
    return datetime.strptime(time_text, "%H:%M").time()
