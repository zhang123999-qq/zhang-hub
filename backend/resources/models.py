from django.db import models
from users.models import User

class Resource(models.Model):
    RESOURCE_TYPES = (
        ('tool', '工具'),
        ('document', '文档'),
        ('course', '课程'),
        ('other', '其他'),
    )
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    url = models.URLField()
    type = models.CharField(max_length=20, choices=RESOURCE_TYPES)
    submitter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resources')
    tags = models.JSONField(default=list, blank=True)
    download_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
