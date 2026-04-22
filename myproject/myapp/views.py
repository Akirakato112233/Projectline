from functools import lru_cache
import logging

import certifi
from django.conf import settings
from django.http import HttpResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt

from linebot.v3 import WebhookHandler
from linebot.v3.exceptions import InvalidSignatureError
from linebot.v3.messaging.exceptions import ApiException
from linebot.v3.messaging import (
    ApiClient,
    Configuration,
    MessagingApi,
    ReplyMessageRequest,
)
from linebot.v3.webhooks import MessageEvent, TextMessageContent

from .handlers import handle_text_message

logger = logging.getLogger(__name__)


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
    except InvalidSignatureError:
        logger.exception("Invalid LINE signature")
        return HttpResponseBadRequest("Invalid signature")
    except Exception as e:
        logger.exception("Webhook processing failed")
        return HttpResponseBadRequest(str(e))

    return HttpResponse("OK")


def handle_message(event):
    user_text = event.message.text
    reply_message = handle_text_message(user_text) 
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
                    messages=[reply_message],
                )
            )
    except ApiException as e:
        logger.exception("LINE reply API failed")
        raise ValueError(
            f"LINE reply API failed: status={e.status}, reason={e.reason}, body={e.body}"
        ) from e


handler = get_handler()
if handler is not None:
    handler.add(MessageEvent, message=TextMessageContent)(handle_message)
