from django.contrib import admin

from .models import User




@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        "line_user_id",
        "full_name",
        "birth_date",
        "birth_time",
        "birth_place",
        "gender",
        "zodiac_sign",
        "step",
        "created_at",
    )
    list_filter = ("gender", "zodiac_sign", "step")
    search_fields = ("line_user_id", "full_name", "birth_place")
