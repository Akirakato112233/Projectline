from functools import lru_cache
import logging
from django.http import HttpResponse, JsonResponse
import json

import certifi
from django.conf import settings
from django.http import HttpResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from linebot.v3 import WebhookHandler
from linebot.v3.exceptions import InvalidSignatureError
from linebot.v3.messaging.exceptions import ApiException
from linebot.v3.messaging import (
    ApiClient,
    Configuration,
    MessagingApi,
    ReplyMessageRequest,
    TextMessage,
)
from linebot.v3.webhooks import MessageEvent, TextMessageContent

from .services import call_dify_astrology

from myapp.handlers import process_user_message


logger = logging.getLogger(__name__)

from myapp.models import WebhookLog, SystemEventLog


@lru_cache(maxsize=1)
def get_handler() -> WebhookHandler | None:
    if not settings.LINE_CHANNEL_SECRET:
        return None
    return WebhookHandler(settings.LINE_CHANNEL_SECRET)


@lru_cache(maxsize=1)
def get_configuration() -> Configuration | None:
    if not settings.LINE_CHANNEL_ACCESS_TOKEN:
        return None
    return Configuration(
        access_token=settings.LINE_CHANNEL_ACCESS_TOKEN,
        ssl_ca_cert=certifi.where(),
    )


@csrf_exempt
def webhook(request):
    if request.method != "POST":
        return HttpResponseBadRequest("Only POST allowed")

    handler = get_handler()
    if handler is None:
        return HttpResponseBadRequest("LINE_CHANNEL_SECRET is not configured")

    signature = request.headers.get("X-Line-Signature")
    body = request.body.decode("utf-8")

    try:
        handler.handle(body, signature)
    except InvalidSignatureError as e:
        WebhookLog.objects.create(
            status_code=400,
            is_success=False,
            error_message=str(e),
        )
        SystemEventLog.objects.create(
            level="error",
            event_type="invalid_signature",
            title="LINE webhook signature ไม่ถูกต้อง",
            detail=str(e),
        )
        logger.exception("Invalid LINE signature")
        return HttpResponseBadRequest("Invalid signature")
    except Exception as e:
        WebhookLog.objects.create(
            status_code=500,
            is_success=False,
            error_message=str(e),
        )
        SystemEventLog.objects.create(
            level="error",
            event_type="webhook_failed",
            title="Webhook processing failed",
            detail=str(e),
        )
        logger.exception("Webhook processing failed")
        return HttpResponseBadRequest(str(e))

    return HttpResponse("OK")


def handle_message(event):
    user_text = event.message.text
    reply_message = process_user_message(event.source.user_id, user_text)
    configuration = get_configuration()

    logger.info("Received LINE message: %s", user_text)

    if configuration is None:
        raise ValueError("LINE_CHANNEL_ACCESS_TOKEN is not configured")

    try:
        with ApiClient(configuration) as api_client:
            line_bot_api = MessagingApi(api_client)
            line_bot_api.reply_message(
                ReplyMessageRequest(
                    reply_token=event.reply_token,
                    messages=[TextMessage(text=reply_message)],
                )
            )

        WebhookLog.objects.create(
            line_user_id=event.source.user_id,
            event_type=event.type,
            status_code=200,
            is_success=True,
        )
        SystemEventLog.objects.create(
            level="info",
            event_type="line_reply_success",
            title="ส่งข้อความตอบกลับ LINE สำเร็จ",
            detail=f"user_id={event.source.user_id}, message={user_text}",
        )

    except ApiException as e:
        WebhookLog.objects.create(
            line_user_id=event.source.user_id,
            event_type=event.type,
            status_code=e.status,
            is_success=False,
            error_message=e.body or e.reason,
        )
        SystemEventLog.objects.create(
            level="error",
            event_type="line_reply_failed",
            title="LINE reply API failed",
            detail=e.body or e.reason,
        )

        logger.exception("LINE reply API failed")
        raise ValueError(
            f"LINE reply API failed: status={e.status}, reason={e.reason}, body={e.body}"
        ) from e


handler = get_handler()
if handler is not None:
    handler.add(MessageEvent, message=TextMessageContent)(handle_message)
    
