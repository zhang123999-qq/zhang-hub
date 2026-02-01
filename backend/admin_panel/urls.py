from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView
from django.http import JsonResponse
from .admin import minimal_admin

# API根路径视图
def api_root(request):
    return JsonResponse({
        'status': 'success',
        'message': 'CodeSecHub API',
        'version': '1.0.0',
        'endpoints': {
            'users': '/api/users/',
            'blog': '/api/blog/',
            'forum': '/api/forum/',
            'resources': '/api/resources/'
        }
    })

urlpatterns = [
    # 重定向根路径到前端首页
    path('', RedirectView.as_view(url='http://localhost:5173', permanent=False)),
    
    # 极简管理后台
    path('admin/', minimal_admin.urls),
    
    # API接口
    path('api/', api_root),
    path('api/users/', include('users.api.urls')),
    path('api/blog/', include('blog.api.urls')),
    path('api/forum/', include('forum.api.urls')),
    path('api/resources/', include('resources.api.urls')),
    
    # 内置Django管理（备用）
    path('django-admin/', admin.site.urls),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
