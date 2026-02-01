from django.urls import path
from backend.blog.views import ArticleListAPIView, ArticleDetailAPIView, ArticleCreateAPIView, CategoryListAPIView

urlpatterns = [
    path('articles/', ArticleListAPIView.as_view(), name='article_list'),
    path('articles/<slug:slug>/', ArticleDetailAPIView.as_view(), name='article_detail'),
    path('articles/create/', ArticleCreateAPIView.as_view(), name='article_create'),
    path('categories/', CategoryListAPIView.as_view(), name='category_list'),
]
