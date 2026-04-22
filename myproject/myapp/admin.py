from django.contrib import admin

from .models import ZodiacKnowledge


@admin.register(ZodiacKnowledge)
class ZodiacKnowledgeAdmin(admin.ModelAdmin):
    list_display = ("subject", "category", "source", "published_at")
    list_filter = ("subject", "category", "source")
    search_fields = ("subject", "category", "content", "source_title")
