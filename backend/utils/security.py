from functools import wraps
from django.core.exceptions import ValidationError
import bleach

def sanitize_input(allowed_tags=None, allowed_attributes=None):
    """输入净化装饰器"""
    def decorator(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            if request.method in ['POST', 'PUT']:
                data = request.data.copy()
                
                # 清理字符串字段
                for key, value in data.items():
                    if isinstance(value, str):
                        data[key] = bleach.clean(
                            value,
                            tags=allowed_tags or ['p', 'br', 'code', 'pre'],
                            attributes=allowed_attributes or {'code': ['class']}
                        )
                
                # 检查恶意内容
                if contains_malicious_content(data):
                    raise ValidationError("检测到可疑内容")
                
                request.data = data
            
            return func(request, *args, **kwargs)
        return wrapper
    return decorator

def contains_malicious_content(data):
    """检查是否包含恶意内容"""
    malicious_patterns = [
        '<script',
        'javascript:',
        'onerror=',
        'onload=',
        'onclick=',
        'eval(',
        'alert(',
        'document.cookie',
    ]
    
    for key, value in data.items():
        if isinstance(value, str):
            lower_value = value.lower()
            for pattern in malicious_patterns:
                if pattern in lower_value:
                    return True
    
    return False
