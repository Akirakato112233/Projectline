from rest_framework import serializers

from myapp.models import User, DifyRequestLog, SystemEventLog, WebhookLog


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "line_user_id",
            "step",
            "full_name",
            "birth_date",
            "birth_time",
            "birth_place",
            "gender",
            "zodiac_sign",
            "star_positions",
            "updated_at",
            "last_active_at",
            "created_at",
        ]
class DifyRequestLogSerializer(serializers.ModelSerializer):
    line_user_id = serializers.CharField(source="user.line_user_id", read_only=True)
    full_name = serializers.CharField(source="user.full_name", read_only=True)

    class Meta:
        model = DifyRequestLog
        fields = [
            "id",
            "line_user_id",
            "full_name",
            "query",
            "status",
            "response_time_ms",
            "error_message",
            "conversation_id",
            "created_at",
        ]
class SystemEventLogSerializer(serializers.ModelSerializer):
    line_user_id = serializers.CharField(source="user.line_user_id", read_only=True)
    full_name = serializers.CharField(source="user.full_name", read_only=True)

    class Meta:
        model = SystemEventLog
        fields = [
            "id",
            "level",
            "event_type",
            "title",
            "detail",
            "line_user_id",
            "full_name",
            "created_at",
        ]
from myapp.models import DifyRequestLog, SystemEventLog, User, WebhookLog


class WebhookLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebhookLog
        fields = [
            "id",
            "line_user_id",
            "event_type",
            "status_code",
            "is_success",
            "error_message",
            "created_at",
        ]
