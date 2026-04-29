def build_tarot_flex_contents(result):
    if result is None:
        return None

    card = result["card"]
    topic = result["topic"]
    advice_text = result["advice_text"]

    body_contents = [
        {
            "type": "text",
            "text": "ไพ่ของคุณ",
            "color": "#E7B93E",
            "size": "sm",
            "weight": "bold",
            "align": "center"
        },
        {
            "type": "text",
            "text": card.name_th,
            "color": "#FFFFFF",
            "size": "xl",
            "weight": "bold",
            "align": "center",
            "wrap": True,
            "margin": "md"
        },
        {
            "type": "text",
            "text": card.name,
            "color": "#CFC4E8",
            "size": "sm",
            "align": "center",
            "wrap": True,
            "margin": "sm"
        },
        {
            "type": "separator",
            "margin": "lg",
            "color": "#70508F"
        },
        {
            "type": "text",
            "text": card.meaning,
            "color": "#F3EEFF",
            "size": "sm",
            "wrap": True,
            "margin": "lg"
        }
    ]

    if topic != "ทั่วไป":
        body_contents.extend([
            {
                "type": "separator",
                "margin": "lg",
                "color": "#70508F"
            },
            {
                "type": "text",
                "text": f"คำทำนายด้าน{topic}",
                "color": "#E7B93E",
                "size": "sm",
                "weight": "bold",
                "margin": "lg"
            },
            {
                "type": "text",
                "text": advice_text,
                "color": "#FFFFFF",
                "size": "sm",
                "wrap": True,
                "margin": "md"
            }
        ])

    return {
        "type": "bubble",
        "size": "mega",
        "styles": {
            "body": {
                "backgroundColor": "#2E1450"
            },
            "footer": {
                "backgroundColor": "#2E1450"
            }
        },
        "hero": {
            "type": "image",
            "url": card.image_url,
            "size": "full",
            "aspectRatio": "3:4",
            "aspectMode": "cover"
        },
        "body": {
            "type": "box",
            "layout": "vertical",
            "spacing": "sm",
            "contents": body_contents,
            "paddingAll": "20px",
            "borderColor": "#8B6A2B",
            "borderWidth": "1px",
            "cornerRadius": "18px",
            "backgroundColor": "#2E1450"
        }
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
                    "color": "#FFFFFF"
                },
                {
                    "type": "box",
                    "layout": "horizontal",
                    "spacing": "md",
                    "margin": "lg",
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
                                "text": f"{topic_token_prefix}_1"
                            }
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
                                "text": f"{topic_token_prefix}_2"
                            }
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
                                "text": f"{topic_token_prefix}_3"
                            }
                        }
                    ]
                }
            ],
            "paddingAll": "20px",
            "backgroundColor": "#2E1450"
        }
    }
