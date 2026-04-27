from rest_framework.decorators import api_view
from rest_framework.response import Response

from myapp.api.auth_utils import admin_login_required
from myapp.models import DifyRequestLog
from myapp.api.serializers import DifyRequestLogSerializer


@api_view(["GET"])
@admin_login_required
def dify_request_list(request):
    logs = DifyRequestLog.objects.select_related("user").order_by("-created_at")
    serializer = DifyRequestLogSerializer(logs, many=True)
    return Response(serializer.data)
