from django.urls import path
from resources.views import ResourceListAPIView, ResourceDetailAPIView, ResourceCreateAPIView

urlpatterns = [
    path('resources/', ResourceListAPIView.as_view(), name='resource_list'),
    path('resources/<int:pk>/', ResourceDetailAPIView.as_view(), name='resource_detail'),
    path('resources/create/', ResourceCreateAPIView.as_view(), name='resource_create'),
]
