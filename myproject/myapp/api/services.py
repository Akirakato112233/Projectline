import json
import time

import requests
from django.conf import settings

from ..models import DifyRequestLog, SystemEventLog

DIFY_API_URL = "https://api.dify.ai/v1/chat-messages"
DIFY_API_KEY = settings.DIFY_API_KEY


def call_dify_astrology(user_query, star_data, user_id="system_user", conversation_id="", user=None):
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

    log = DifyRequestLog.objects.create(
        user=user,
        query=user_query,
        status="pending",
    )
    start_time = time.time()

    try:
        response = requests.post(DIFY_API_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        result = response.json()
        response_time_ms = int((time.time() - start_time) * 1000)

        log.status = "success"
        log.response_time_ms = response_time_ms
        log.conversation_id = result.get("conversation_id", "")
        log.save()
        SystemEventLog.objects.create(
            level="info",
            event_type="dify_success",
            title="Dify ตอบกลับสำเร็จ",
            detail=f"user_id={user_id}, query={user_query}",
            user=user,
        )

        return result.get("answer", "ไม่มีข้อความตอบกลับมา")
    except requests.HTTPError as e:
        response = e.response
        status_code = response.status_code if response is not None else "unknown"
        response_body = response.text if response is not None else ""

        log.status = "failed"
        log.error_message = response_body or str(e)
        log.response_time_ms = int((time.time() - start_time) * 1000)
        log.save()
        SystemEventLog.objects.create(
            level="error",
            event_type="dify_failed",
            title="Dify API failed",
            detail=response_body or str(e),
            user=user,
        )

        print(f"Error calling Dify: status={status_code}, body={response_body}")
        return "ขออภัยครับ ขณะนี้ดวงดาวเคลื่อนที่ผิดปกติ โปรดลองใหม่อีกครั้งในภายหลัง"
    except Exception as e:
        log.status = "failed"
        log.error_message = str(e)
        log.response_time_ms = int((time.time() - start_time) * 1000)
        log.save()
        SystemEventLog.objects.create(
            level="error",
            event_type="dify_failed",
            title="Dify API failed",
            detail=str(e),
            user=user,
        )

        print(f"Error calling Dify: {e}")
        return "ขออภัยครับ ขณะนี้ดวงดาวเคลื่อนที่ผิดปกติ โปรดลองใหม่อีกครั้งในภายหลัง"
