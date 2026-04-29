from functools import lru_cache
import logging

import certifi
from django.conf import settings
from django.http import HttpResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from myapp.tarot.tarot_services import get_tarot_result, build_tarot_reply
from myapp.tarot.tarot_flex import build_tarot_flex_contents, build_tarot_pick_flex

from linebot.v3 import WebhookHandler
from linebot.v3.exceptions import InvalidSignatureError
from linebot.v3.messaging.exceptions import ApiException
from linebot.v3.messaging import (
    ApiClient,
    Configuration,
    MessagingApi,
    ReplyMessageRequest,
    TextMessage,
    QuickReply,
    QuickReplyItem,
    MessageAction,
    FlexMessage,
)
from linebot.v3.webhooks import MessageEvent, TextMessageContent

from myapp.handlers import process_user_message


logger = logging.getLogger(__name__)

from myapp.models import WebhookLog, SystemEventLog


TAROT_CARD_BACK_URL = "https://astroflow.a-zens.com/static/myapp/images/tarot-card-back.svg"
TAROT_PICK_PREFIXES = {
    "ทั่วไป": "TAROT_GENERAL",
    "ความรัก": "TAROT_LOVE",
    "การเรียน": "TAROT_STUDY",
    "การงาน": "TAROT_WORK",
    "ชีวิต": "TAROT_LIFE",
    "สุขภาพ": "TAROT_HEALTH",
}
TAROT_TOKEN_TOPICS = {
    f"{prefix}_": topic for topic, prefix in TAROT_PICK_PREFIXES.items()
}


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

    if not signature:
        WebhookLog.objects.create(
            status_code=400,
            is_success=False,
            error_message="Missing X-Line-Signature header",
        )
        SystemEventLog.objects.create(
            level="error",
            event_type="missing_signature",
            title="LINE webhook ไม่มี signature",
            detail="Missing X-Line-Signature header",
        )
        logger.warning("Missing LINE signature header")
        return HttpResponseBadRequest("Missing signature")

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
    user_text = event.message.text.strip()
    configuration = get_configuration()

    logger.info("Received LINE message: %s", user_text)

    if configuration is None:
        raise ValueError("LINE_CHANNEL_ACCESS_TOKEN is not configured")

    if user_text == "เมนูการงานการเรียน":
        try:
            with ApiClient(configuration) as api_client:
                line_bot_api = MessagingApi(api_client)
                line_bot_api.reply_message(
                    ReplyMessageRequest(
                        reply_token=event.reply_token,
                        messages=[
                            TextMessage(
                                text="เลือกหัวข้อที่ต้องการได้เลย",
                                quick_reply=QuickReply(
                                    items=[
                                        QuickReplyItem(
                                            action=MessageAction(label="การงานช่วงนี้", text="การงานช่วงนี้")
                                        ),
                                        QuickReplyItem(
                                            action=MessageAction(label="การเรียนช่วงนี้", text="การเรียนช่วงนี้")
                                        ),
                                    ]
                                ),
                            )
                        ],
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
                event_type="line_quick_reply_success",
                title="ส่ง quick reply เมนูการงานการเรียนสำเร็จ",
                detail=f"user_id={event.source.user_id}",
            )
            return

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
                event_type="line_quick_reply_failed",
                title="ส่ง quick reply เมนูการงานการเรียนไม่สำเร็จ",
                detail=e.body or e.reason,
            )
            logger.exception("LINE quick reply failed")
            raise ValueError(
                f"LINE quick reply failed: status={e.status}, reason={e.reason}, body={e.body}"
            ) from e

    if user_text == "ไพ่ทาโร่":
        try:
            with ApiClient(configuration) as api_client:
                line_bot_api = MessagingApi(api_client)
                line_bot_api.reply_message(
                    ReplyMessageRequest(
                        reply_token=event.reply_token,
                        messages=[
                            TextMessage(
                                text="เลือกหัวข้อไพ่ทาโร่ได้เลย",
                                quick_reply=QuickReply(
                                    items=[
                                        QuickReplyItem(
                                            action=MessageAction(label="โดยรวม", text="ทั่วไป")
                                        ),
                                        QuickReplyItem(
                                            action=MessageAction(label="การเรียน", text="การเรียน")
                                        ),
                                        QuickReplyItem(
                                            action=MessageAction(label="ความรัก", text="ความรัก")
                                        ),
                                        QuickReplyItem(
                                            action=MessageAction(label="การงาน", text="การงาน")
                                        ),
                                        QuickReplyItem(
                                            action=MessageAction(label="ชีวิต", text="ชีวิต")
                                        ),
                                        QuickReplyItem(
                                            action=MessageAction(label="สุขภาพ", text="สุขภาพ")
                                        ),
                                    ]
                                ),
                            )
                        ],
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
                event_type="line_quick_reply_success",
                title="ส่ง quick reply เมนูไพ่ทาโร่สำเร็จ",
                detail=f"user_id={event.source.user_id}",
            )
            return

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
                event_type="line_quick_reply_failed",
                title="ส่ง quick reply เมนูไพ่ทาโร่ไม่สำเร็จ",
                detail=e.body or e.reason,
            )
            logger.exception("LINE quick reply failed")
            raise ValueError(
                f"LINE quick reply failed: status={e.status}, reason={e.reason}, body={e.body}"
            ) from e

    if user_text in TAROT_PICK_PREFIXES:
        topic_prefix = TAROT_PICK_PREFIXES[user_text]
        flex_contents = build_tarot_pick_flex(topic_prefix, TAROT_CARD_BACK_URL)
        messages = [
            FlexMessage(
                alt_text=f"เลือกไพ่ด้าน{user_text}",
                contents=flex_contents,
            )
        ]

        try:
            with ApiClient(configuration) as api_client:
                line_bot_api = MessagingApi(api_client)
                line_bot_api.reply_message(
                    ReplyMessageRequest(
                        reply_token=event.reply_token,
                        messages=messages,
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
                event_type="line_tarot_pick_success",
                title="ส่งหน้าเลือกไพ่ทาโร่สำเร็จ",
                detail=f"user_id={event.source.user_id}, topic={user_text}",
            )
            return

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
                event_type="line_tarot_pick_failed",
                title="ส่งหน้าเลือกไพ่ทาโร่ไม่สำเร็จ",
                detail=e.body or e.reason,
            )
            logger.exception("LINE tarot pick failed")
            raise ValueError(
                f"LINE tarot pick failed: status={e.status}, reason={e.reason}, body={e.body}"
            ) from e

    picked_topic = next(
        (topic for token_prefix, topic in TAROT_TOKEN_TOPICS.items() if user_text.startswith(token_prefix)),
        None,
    )
    if picked_topic is not None:
        result = get_tarot_result(picked_topic)
        reply_message = build_tarot_reply(result)
        flex_contents = build_tarot_flex_contents(result) if result is not None else None

        if flex_contents is None:
            messages = [TextMessage(text=reply_message)]
        else:
            messages = [
                FlexMessage(
                    alt_text=f"ไพ่ของคุณ: {result['card'].name_th}",
                    contents=flex_contents,
                )
            ]

        try:
            with ApiClient(configuration) as api_client:
                line_bot_api = MessagingApi(api_client)
                line_bot_api.reply_message(
                    ReplyMessageRequest(
                        reply_token=event.reply_token,
                        messages=messages,
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
                event_type="line_tarot_reply_success",
                title="ส่งผลไพ่ทาโร่สำเร็จ",
                detail=f"user_id={event.source.user_id}, topic={picked_topic}",
            )
            return

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
                event_type="line_tarot_reply_failed",
                title="ส่งผลไพ่ทาโร่ไม่สำเร็จ",
                detail=e.body or e.reason,
            )
            logger.exception("LINE tarot reply failed")
            raise ValueError(
                f"LINE tarot reply failed: status={e.status}, reason={e.reason}, body={e.body}"
            ) from e

    reply_message = process_user_message(event.source.user_id, user_text)

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
    
