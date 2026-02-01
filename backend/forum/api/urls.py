from django.urls import path
from forum.views import PostListAPIView, PostDetailAPIView, PostCreateAPIView, CommentCreateAPIView

urlpatterns = [
    path('posts/', PostListAPIView.as_view(), name='post_list'),
    path('posts/<int:pk>/', PostDetailAPIView.as_view(), name='post_detail'),
    path('posts/create/', PostCreateAPIView.as_view(), name='post_create'),
    path('comments/create/', CommentCreateAPIView.as_view(), name='comment_create'),
]
