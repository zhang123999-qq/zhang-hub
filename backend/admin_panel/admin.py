from django.contrib import admin
from django.contrib.auth.models import Group
from django.utils.html import format_html
from django.urls import path
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.db.models import Count
from datetime import datetime, timedelta
from django.http import JsonResponse
from users.models import User
from blog.models import Article
from forum.models import Post, Comment

# 移除默认的Group管理
admin.site.unregister(Group)

class MinimalAdminSite(admin.AdminSite):
    site_header = "📊 zhang 管理后台"
    site_title = "极简管理面板"
    index_title = "欢迎使用安全博客管理系统"
    
    def get_app_list(self, request):
        """
        简化应用列表，只显示核心功能
        """
        app_dict = self._build_app_dict(request)
        app_list = []
        
        # 只保留核心应用
        core_apps = ['users', 'blog', 'forum', 'resources']
        for app_label, app in app_dict.items():
            if app_label in core_apps:
                app_list.append(app)
        
        return app_list

# 创建自定义管理站点
minimal_admin = MinimalAdminSite(name='minimal_admin')

# 用户管理配置
@admin.register(User, site=minimal_admin)
class MinimalUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'reputation', 'is_active', 'date_joined')
    list_filter = ('role', 'is_active', 'date_joined')
    search_fields = ('username', 'email')
    readonly_fields = ('date_joined', 'last_login')
    actions = ['activate_users', 'deactivate_users']
    
    fieldsets = (
        ('基本信息', {
            'fields': ('username', 'email', 'password')
        }),
        ('权限与状态', {
            'fields': ('role', 'is_active', 'is_staff', 'is_superuser')
        }),
        ('个人资料', {
            'fields': ('bio', 'github_url', 'skills')
        }),
        ('统计信息', {
            'fields': ('reputation', 'date_joined', 'last_login')
        }),
    )
    
    def activate_users(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(request, f"已激活 {queryset.count()} 个用户")
    activate_users.short_description = "激活选中用户"
    
    def deactivate_users(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(request, f"已停用 {queryset.count()} 个用户")
    deactivate_users.short_description = "停用选中用户"

# 文章管理配置
@admin.register(Article, site=minimal_admin)
class MinimalArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'status', 'view_count', 'created_at')
    list_filter = ('status', 'category', 'created_at')
    search_fields = ('title', 'content')
    list_editable = ('status',)
    exclude = ('created_at', 'updated_at')
    
    fieldsets = (
        ('基本信息', {
            'fields': ('title', 'author', 'category', 'tags')
        }),
        ('内容', {
            'fields': ('content', 'summary')
        }),
        ('发布设置', {
            'fields': ('status', 'is_featured', 'allow_comments')
        }),
        ('统计', {
            'fields': ('view_count', 'like_count')
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not change:
            obj.author = request.user
        super().save_model(request, obj, form, change)

# 极简仪表板视图
class MinimalDashboardView(admin.ModelAdmin):
    change_list_template = 'admin/minimal_dashboard.html'
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('dashboard/', self.admin_site.admin_view(self.dashboard_view), name='dashboard'),
            path('quick-stats/', self.admin_site.admin_view(self.quick_stats_view), name='quick_stats'),
        ]
        return custom_urls + urls
    
    def dashboard_view(self, request):
        today = datetime.now().date()
        week_ago = today - timedelta(days=7)
        
        context = {
            'title': '系统概览',
            'user_count': User.objects.count(),
            'article_count': Article.objects.count(),
            'today_articles': Article.objects.filter(created_at__date=today).count(),
            'week_articles': Article.objects.filter(created_at__date__gte=week_ago).count(),
            'recent_users': User.objects.order_by('-date_joined')[:5],
            'recent_articles': Article.objects.select_related('author').order_by('-created_at')[:5],
            'top_categories': Article.objects.values('category').annotate(
                count=Count('id')
            ).order_by('-count')[:5],
        }
        return render(request, 'admin/minimal_dashboard.html', context)
    
    def quick_stats_view(self, request):
        stats = {
            'users': {
                'total': User.objects.count(),
                'today': User.objects.filter(date_joined__date=datetime.now().date()).count(),
                'active': User.objects.filter(is_active=True).count(),
            },
            'content': {
                'articles': Article.objects.count(),
                'comments': Comment.objects.count(),
                'published': Article.objects.filter(status='published').count(),
            }
        }
        return JsonResponse(stats)

# 注册仪表板 - 使用自定义URL配置

# 添加快捷操作按钮
class QuickActionAdmin(admin.ModelAdmin):
    actions = ['export_as_json', 'mark_as_featured']
    
    def export_as_json(self, request, queryset):
        data = list(queryset.values())
        response = JsonResponse(data, safe=False)
        response['Content-Disposition'] = 'attachment; filename="export.json"'
        return response
    export_as_json.short_description = "导出为JSON"
    
    def mark_as_featured(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(request, f"{updated} 个项目已设为推荐")
    mark_as_featured.short_description = "设为推荐内容"
