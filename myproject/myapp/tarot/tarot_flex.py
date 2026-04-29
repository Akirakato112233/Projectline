GOLD = "#E7B93E"
PURPLE = "#2E1450"
SOFT_PURPLE = "#70508F"
WHITE = "#F6F0FF"
MUTED = "#CFC4E8"


def build_text_section(title, text):
    return {
        "type": "box",
        "layout": "vertical",
        "margin": "lg",
        "spacing": "sm",
        "contents": [
            {
                "type": "text",
                "text": title,
                "color": GOLD,
                "size": "md",
                "weight": "bold",
                "wrap": True,
            },
            {
                "type": "text",
                "text": text,
                "color": WHITE,
                "size": "sm",
                "wrap": True,
            },
        ],
    }


def build_tarot_flex_contents(result):
    if result is None:
        return None

    card = result["card"]
    topic = result["topic"]
    advice_text = result["advice_text"]

    advice_title = "คำทำนายวันนี้" if topic == "ทั่วไป" else f"คำทำนายด้าน{topic}"

    body_contents = [
        {
            "type": "text",
            "text": "ไพ่ของคุณ",
            "color": GOLD,
            "size": "md",
            "weight": "bold",
            "align": "center",
        },
        {
            "type": "image",
            "url": card.image_url,
            "size": "full",
            "aspectMode": "cover",
            "aspectRatio": "3:4",
            "margin": "lg",
        },
        {
            "type": "text",
            "text": card.name_th,
            "color": GOLD,
            "size": "xxl",
            "weight": "bold",
            "align": "center",
            "wrap": True,
            "margin": "lg",
        },
        {
            "type": "text",
            "text": card.name,
            "color": MUTED,
            "size": "md",
            "align": "center",
            "wrap": True,
            "margin": "sm",
        },
        {
            "type": "separator",
            "margin": "lg",
            "color": SOFT_PURPLE,
        },
        build_text_section("ความหมาย", card.meaning),
        {
            "type": "separator",
            "margin": "lg",
            "color": SOFT_PURPLE,
        },
        build_text_section(advice_title, advice_text),
    ]

    return {
        "type": "bubble",
        "size": "mega",
        "body": {
            "type": "box",
            "layout": "vertical",
            "spacing": "sm",
            "contents": body_contents,
            "paddingAll": "20px",
            "borderColor": "#8B6A2B",
            "borderWidth": "2px",
            "cornerRadius": "20px",
            "backgroundColor": PURPLE,
        },
    }


def build_tarot_pick_flex(topic_token_prefix, card_back_url):
    return {
        "type": "bubble",
        "size": "giga",
        "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
                {
                    "type": "text",
                    "text": "เลือกไพ่ 1 ใบ",
                    "weight": "bold",
                    "size": "lg",
                    "align": "center",
                    "color": WHITE,
                },
                {
                    "type": "text",
                    "text": "ตั้งจิตแล้วเลือกใบที่ดึงดูดใจคุณที่สุด",
                    "size": "sm",
                    "align": "center",
                    "color": MUTED,
                    "wrap": True,
                    "margin": "md",
                },
                {
                    "type": "box",
                    "layout": "horizontal",
                    "spacing": "md",
                    "margin": "xl",
                    "contents": [
                        {
                            "type": "image",
                            "url": card_back_url,
                            "size": "sm",
                            "aspectMode": "cover",
                            "aspectRatio": "2:3",
                            "action": {
                                "type": "message",
                                "label": "ใบที่ 1",
                                "text": f"{topic_token_prefix}_1",
                            },
                        },
                        {
                            "type": "image",
                            "url": card_back_url,
                            "size": "sm",
                            "aspectMode": "cover",
                            "aspectRatio": "2:3",
                            "action": {
                                "type": "message",
                                "label": "ใบที่ 2",
                                "text": f"{topic_token_prefix}_2",
                            },
                        },
                        {
                            "type": "image",
                            "url": card_back_url,
                            "size": "sm",
                            "aspectMode": "cover",
                            "aspectRatio": "2:3",
                            "action": {
                                "type": "message",
                                "label": "ใบที่ 3",
                                "text": f"{topic_token_prefix}_3",
                            },
                        },
                    ],
                },
            ],
            "paddingAll": "20px",
            "borderColor": "#8B6A2B",
            "borderWidth": "2px",
            "cornerRadius": "20px",
            "backgroundColor": PURPLE,
        },
    }
