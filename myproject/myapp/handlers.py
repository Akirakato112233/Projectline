from linebot.v3.messaging import TextMessage


def handle_text_message(user_text: str) -> TextMessage:
    return TextMessage(text=f"คุณพิมพ์ว่า: {user_text}")