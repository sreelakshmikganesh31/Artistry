from django.contrib import admin
from .models import CustomUser, Post, Comment
from django.contrib.auth.admin import UserAdmin

# Register CustomUser
@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'phone', 'is_staff', 'is_active']

# Register Post
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'created_by', 'created_at']
    list_filter = ['created_at']
    search_fields = ['title', 'description', 'created_by__username']

# Register Comment
@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['user', 'post', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'post__title', 'content']
