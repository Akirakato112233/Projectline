from datetime import datetime
from zoneinfo import ZoneInfo

from .models import User
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


    if user.step < 2:

        info = extract_data(message_text)

        if 'name' in info and 'date' in info and 'time' in info and 'place' in info and 'gender' in info:
            try:
                birth_date = parse_thai_birth_date(info['date'])
                birth_time = parse_birth_time(info['time'])
            except ValueError:
                return "รูปแบบวันเกิดหรือเวลาไม่ถูกต้องครับ กรุณาส่งเป็น:\nเกิด: 15/05/2535\nเวลา: 08:30"

            user.full_name = info['name']
            user.birth_place = get_smart_province(info['place'])
            user.birth_date = birth_date
            user.birth_time = birth_time
            user.gender = info['gender']

            stars = calculate_star_positions(user.birth_date, user.birth_time)
            user.star_positions = stars 
            lat, lon = get_smart_lat_lon(user.birth_place)
            user.zodiac_sign = calculate_with_ascendant(user.birth_date, user.birth_time, lat, lon)
            user.step = 2
            user.save()
            return f"เรียบร้อยครับคุณ {user.full_name} ทีนี้อยากถามอะไร พิมพ์มาได้เลย!"
        
        else:
            return build_missing_info_message(info)

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
    )


def extract_data(text):
    result = {}
    
    lines = text.split('\n') 
    
    for line in lines:
        if ':' in line:
            parts = line.split(':', 1)
            key = parts[0].strip()  
            value = parts[1].strip() 
            
            if "ชื่อ" in key: result['name'] = value
            if "เกิด" in key: result['date'] = value
            if "เวลา" in key: result['time'] = value
            if "เพศ" in key: result['gender'] = value
            if "จังหวัด" in key: result['place'] = value
            
    return result


def build_missing_info_message(info):
    required_fields = {
        'name': 'ชื่อ',
        'date': 'เกิด',
        'time': 'เวลา',
        'place': 'จังหวัด',
        'gender': 'เพศ',
    }
    missing_fields = [
        label
        for key, label in required_fields.items()
        if key not in info or not info[key]
    ]
    missing_text = ", ".join(missing_fields)

    return (
        f"ข้อมูลยังไม่ครบครับ ขาด: {missing_text}\n"
        "กรุณาส่งข้อมูลให้ครบตามรูปแบบนี้ครับเพื่อที่จะได้ทำนายได้ถูกต้อง:\n"
        "ชื่อ: ...\n"
        "เกิด: ...\n"
        "เวลา: ...\n"
        "จังหวัด: ...\n"
        "เพศ: ..."
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
