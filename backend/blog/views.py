from rest_framework import generics, permissions
from .models import Article, Category
from .serializers import ArticleSerializer, ArticleCreateSerializer, CategorySerializer

class ArticleListAPIView(generics.ListAPIView):
    queryset = Article.objects.filter(status='published').order_by('-created_at')
    serializer_class = ArticleSerializer

class ArticleDetailAPIView(generics.RetrieveAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    lookup_field = 'slug'

class ArticleCreateAPIView(generics.CreateAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class CategoryListAPIView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
