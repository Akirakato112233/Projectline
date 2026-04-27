from rest_framework.decorators import api_view
from rest_framework.response import Response

from myapp.api.auth_utils import admin_login_required
from myapp.models import SystemEventLog, WebhookLog
from myapp.api.serializers import SystemEventLogSerializer, WebhookLogSerializer


@api_view(["GET"])
@admin_login_required
def system_event_list(request):
    logs = SystemEventLog.objects.select_related("user").order_by("-created_at")
    serializer = SystemEventLogSerializer(logs, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@admin_login_required
def webhook_log_list(request):
    logs = WebhookLog.objects.order_by("-created_at")
    serializer = WebhookLogSerializer(logs, many=True)
    return Response(serializer.data)
