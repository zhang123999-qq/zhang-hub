from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    USER_ROLES = (
        ('visitor', '访客'),
        ('user', '普通用户'),
        ('researcher', '安全研究员'),
        ('admin', '管理员'),
    )
    
    role = models.CharField(max_length=20, choices=USER_ROLES, default='user')
    bio = models.TextField(max_length=500, blank=True)
    github_url = models.URLField(blank=True)
    skills = models.JSONField(default=list, blank=True)
    reputation = models.IntegerField(default=0)
    email_verified = models.BooleanField(default=False)
    two_factor_enabled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'users'
