from django.db import models


class ZodiacKnowledge(models.Model):
    subject = models.CharField(max_length=100, db_index=True) # ราศี
    category = models.CharField(max_length=50, db_index=True) # หมวดหมู่ เช่น "ลักษณะนิสัย", "ความรัก", "การงาน", "สุขภาพ"
    content = models.TextField() 
    source = models.CharField(max_length=100, blank=True) 
    source_url = models.URLField(blank=True)
    source_title = models.CharField(max_length=255, blank=True)
    published_at = models.DateTimeField(null=True, blank=True)
