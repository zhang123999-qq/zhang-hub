from rest_framework import serializers
from .models import Resource

class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ['id', 'title', 'description', 'url', 'type', 'submitter', 'tags', 'download_count', 'created_at']
        read_only_fields = ['submitter', 'download_count', 'created_at']

class ResourceCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ['title', 'description', 'url', 'type', 'tags']
