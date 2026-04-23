from django.conf import settings
import json
import requests


DIFY_API_URL = "https://api.dify.ai/v1/chat-messages"
DIFY_API_KEY = settings.DIFY_API_KEY


def call_dify_astrology(user_query, star_data, user_id="system_user", conversation_id=""):
    headers = {
        "Authorization": f"Bearer {DIFY_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "query": user_query,
        "inputs": {
            "star_data": json.dumps(star_data, ensure_ascii=False),
        },
        "response_mode": "blocking",
        "user": user_id,
    }

    if conversation_id:
        payload["conversation_id"] = conversation_id

    try:
        response = requests.post(DIFY_API_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        result = response.json()
        return result.get("answer", "ไม่มีข้อความตอบกลับมา")
    except requests.HTTPError as e:
        response = e.response
        status_code = response.status_code if response is not None else "unknown"
        response_body = response.text if response is not None else ""
        print(f"Error calling Dify: status={status_code}, body={response_body}")
        return "ขออภัยครับ ขณะนี้ดวงดาวเคลื่อนที่ผิดปกติ โปรดลองใหม่อีกครั้งในภายหลัง"
    except Exception as e:
        print(f"Error calling Dify: {e}")
        return "ขออภัยครับ ขณะนี้ดวงดาวเคลื่อนที่ผิดปกติ โปรดลองใหม่อีกครั้งในภายหลัง"
