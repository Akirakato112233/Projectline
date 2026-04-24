from django.db import models

class User(models.Model):
    line_user_id = models.CharField(max_length=255, unique=True)
    step = models.IntegerField(default=0)
    full_name = models.CharField(max_length=255, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    birth_time = models.TimeField(null=True, blank=True)
    birth_place = models.CharField(max_length=255, blank=True)
    gender = models.CharField(max_length=20, blank=True)
    zodiac_sign = models.CharField(max_length=50, blank=True)
    star_positions = models.JSONField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_active_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class UserMessage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="messages")
    message_text = models.TextField()
    message_type = models.CharField(max_length=50, default="text")
    created_at = models.DateTimeField(auto_now_add=True)

class DifyRequestLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    query = models.TextField()
    status = models.CharField(max_length=20)  # success, failed, pending
    response_time_ms = models.IntegerField(null=True, blank=True)
    error_message = models.TextField(blank=True)
    conversation_id = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class WebhookLog(models.Model):
    line_user_id = models.CharField(max_length=255, blank=True)
    event_type = models.CharField(max_length=50, blank=True)
    status_code = models.IntegerField()
    is_success = models.BooleanField(default=True)
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class SystemEventLog(models.Model):
    level = models.CharField(max_length=20)   # info, warning, error
    event_type = models.CharField(max_length=50)  # user_registered, profile_updated, dify_error
    title = models.CharField(max_length=255)
    detail = models.TextField(blank=True)
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)

class AppSetting(models.Model):
    key = models.CharField(max_length=100, unique=True)
    value = models.JSONField()
    updated_at = models.DateTimeField(auto_now=True)
