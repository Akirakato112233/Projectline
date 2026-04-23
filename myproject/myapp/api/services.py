import requests
import json
from django.conf import settings

# ดึงค่าจาก settings.py เพื่อความปลอดภัย
DIFY_API_URL = "https://api.dify.ai/v1/chat-messages"
DIFY_API_KEY = settings.DIFY_API_KEY  

from django.conf import settings

DIFY_API_KEY = settings.DIFY_API_KEY


def call_dify_astrology(user_query, star_data, user_id="system_user", conversation_id=""):
    headers = {
        "Authorization": f"Bearer {DIFY_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "query": user_query,
        "inputs": {
            "star_data": star_data,
        },
        "response_mode": "blocking",
        "user": user_id,
        "conversation_id": conversation_id,
    }

    try:

        response = requests.post(DIFY_API_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        result = response.json()
        return result.get("answer", "ไม่มีข้อความตอบกลับมา")


    except Exception as e:
        print(f"Error calling Dify: {e}")
        return "ขออภัยครับ ขณะนี้ดวงดาวเคลื่อนที่ผิดปกติ โปรดลองใหม่อีกครั้งในภายหลัง"

    
def get_formatted_stars(user_birthday_data=None):
    """
    Logic การคำนวณหรือดึงตำแหน่งดาวจาก Database 
    แล้วเปลี่ยนเป็นข้อความที่ AI เข้าใจง่าย
    """
    # สมมติ Logic การคำนวณของคุณ
    # ผลลัพธ์ควรเป็น: "ดาว ๑ ราศีสิงห์, ดาว ๕ ทับลัคนา, ดาว ๘ กาลกิณี"
    stars_text = "ผลการคำนวณตำแหน่งดาวปัจจุบัน..." 
    return stars_text
