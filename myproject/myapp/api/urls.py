from django.urls import path

from myapp.api import astrology_views, auth_views, dashboard_views, dify_views, health_views, line_views, log_views, settings_views, user_views

urlpatterns = [
    path("auth/login/", auth_views.admin_login, name="admin-login"),
    path("auth/logout/", auth_views.admin_logout, name="admin-logout"),
    path("auth/me/", auth_views.admin_me, name="admin-me"),
    path("line/webhook/", line_views.webhook, name="webhook"),
    path("users/", user_views.user_list, name="user-list"),
    path("users/incomplete/", user_views.incomplete_user_list, name="incomplete-user-list"),
    path("dashboard/overview/", dashboard_views.overview, name="dashboard-overview"),
    path("astrology/overview/", astrology_views.astrology_overview, name="astrology-overview"),
    path("dify-requests/", dify_views.dify_request_list, name="dify-request-list"),
    path("health/", health_views.health_status, name="health-status"),
    path("system-events/", log_views.system_event_list, name="system-event-list"),
    path("webhook-logs/", log_views.webhook_log_list, name="webhook-log-list"),
    path("settings/", settings_views.app_settings_view, name="app-settings"),
]
