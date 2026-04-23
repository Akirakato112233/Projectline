from django.db import models


class ZodiacKnowledge(models.Model):
    subject = models.CharField(max_length=100, db_index=True) # ราศี
    category = models.CharField(max_length=50, db_index=True) # หมวดหมู่ เช่น "ลักษณะนิสัย", "ความรัก", "การงาน", "สุขภาพ"
    content = models.TextField() 
    source = models.CharField(max_length=100, blank=True) 
    source_url = models.URLField(blank=True)
    source_title = models.CharField(max_length=255, blank=True)
    published_at = models.DateTimeField(null=True, blank=True)

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
    created_at = models.DateTimeField(auto_now_add=True)
