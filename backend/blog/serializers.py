from rest_framework import serializers
from .models import Article, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class ArticleSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField()
    category = CategorySerializer()
    
    class Meta:
        model = Article
        fields = ['id', 'title', 'slug', 'content', 'summary', 'author', 'category', 'tags', 'status', 'is_featured', 'view_count', 'like_count', 'created_at']

class ArticleCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ['title', 'content', 'summary', 'category', 'tags', 'status', 'is_featured', 'allow_comments']
    
    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)
