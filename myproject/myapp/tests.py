import certifi
import json
import tempfile
from django.core.management import call_command
from django.test import Client, TestCase
from django.urls import resolve, reverse

from .models import ZodiacKnowledge
from .handlers import build_zodiac_reply, extract_subject_and_category
from .views import get_configuration, get_handler, webhook


class WebhookUrlTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_webhook_url_resolves_to_view(self):
        resolver = resolve("/api/line/webhook/")
        self.assertEqual(resolver.func, webhook)

    def test_webhook_get_returns_bad_request(self):
        response = self.client.get(reverse("webhook"))
        self.assertEqual(response.status_code, 400)

    def test_get_handler_returns_same_instance(self):
        self.assertIs(get_handler(), get_handler())

    def test_get_configuration_uses_certifi_bundle(self):
        configuration = get_configuration()
        self.assertIsNotNone(configuration)
        self.assertEqual(configuration.ssl_ca_cert, certifi.where())


class ImportZodiacKnowledgeCommandTests(TestCase):
    def test_import_command_creates_rows(self):
        payload = [
            {
                "subject": "เมษ",
                "category": "ความรัก",
                "content": "ทดสอบ",
                "source": "ไทยรัฐ",
                "source_url": "https://example.com",
                "source_title": "ตัวอย่าง",
                "published_at": "2026-04-22T00:00:00+07:00",
            }
        ]

        with tempfile.NamedTemporaryFile("w", suffix=".json", encoding="utf-8", delete=False) as file:
            json.dump(payload, file, ensure_ascii=False)
            json_path = file.name

        call_command("import_zodiac_knowledge", json_path)

        self.assertEqual(ZodiacKnowledge.objects.count(), 1)
        row = ZodiacKnowledge.objects.get()
        self.assertEqual(row.subject, "เมษ")
        self.assertEqual(row.category, "ความรัก")
        self.assertEqual(row.content, "ทดสอบ")


class ZodiacReplyTests(TestCase):
    def setUp(self):
        ZodiacKnowledge.objects.create(
            subject="ราศีเมษ",
            category="โชคลาภ",
            content="มีโอกาสได้โชคจากการตัดสินใจที่รอบคอบ",
            source="test",
        )

    def test_extract_subject_and_category(self):
        subject, category = extract_subject_and_category("ราศีเมษ โชคลาภ")
        self.assertEqual(subject, "ราศีเมษ")
        self.assertEqual(category, "โชคลาภ")

    def test_build_zodiac_reply_returns_database_content(self):
        reply = build_zodiac_reply("ราศีเมษ โชคลาภ")
        self.assertEqual(reply, "ราศีเมษ โชคลาภ\nมีโอกาสได้โชคจากการตัดสินใจที่รอบคอบ")

    def test_build_zodiac_reply_returns_help_for_invalid_input(self):
        reply = build_zodiac_reply("เมษ")
        self.assertEqual(reply, "พิมพ์แบบนี้ได้เลย: ราศีเมษ โชคลาภ")
