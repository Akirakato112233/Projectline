import certifi
from django.test import Client, TestCase
from django.urls import resolve, reverse

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
