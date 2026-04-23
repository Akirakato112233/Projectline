from django.contrib import admin

from .models import ZodiacKnowledge, User


@admin.register(ZodiacKnowledge)
class ZodiacKnowledgeAdmin(admin.ModelAdmin):
    list_display = ("subject", "category", "source", "published_at")
    list_filter = ("subject", "category", "source")
    search_fields = ("subject", "category", "content", "source_title")


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
