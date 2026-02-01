from rest_framework import generics, permissions
from .models import Resource
from .serializers import ResourceSerializer, ResourceCreateSerializer

class ResourceListAPIView(generics.ListAPIView):
    queryset = Resource.objects.order_by('-created_at')
    serializer_class = ResourceSerializer

class ResourceDetailAPIView(generics.RetrieveAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer

class ResourceCreateAPIView(generics.CreateAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourceCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(submitter=self.request.user)
