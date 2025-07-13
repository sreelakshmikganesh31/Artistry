from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegisterAPI, name='register_api'),
    path('api/posts/create/', views.create_post, name='create_post'),
    path('api/user-posts/', views.get_user_posts, name='user-posts'),
    path('api/delete-post/<int:pk>/', views.DeletePostView.as_view(), name='delete-post'),
    path('api/update-post/<int:pk>/', views.UpdatePostView.as_view(), name='update-post'),
    
    path('api/posts/', views.PostListAPIView.as_view(), name='api-posts'),
    # path('api/posts/<int:post_id>/like/', views.like_post, name='api-like-post'),
    path('api/post-comments/<int:post_id>/', views.CommentListCreateView.as_view(), name='post-comments'),


    # path('api/like-post/<int:post_id>/', views.like_post, name='like-post'),
    path('api/like-post/<int:post_id>/', views.like_post, name='like-post'),


    path('api/post-comments/<int:post_id>/', views.CommentListCreateView.as_view(), name='post-comments'),
    # path('api/user-posts/', views.UserPostListAPIView.as_view(), name='user-posts'),
    path('post-detail/<int:pk>/', views.PostDetailView.as_view(), name='post-detail'),
    path('api/token/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'), # admin login logic
    path('api/user/', views.get_user_info, name='get_user_info'),  # this to 
    
    path('api/comments/', views.AllCommentsListView.as_view(), name='all-comments'), #admin page comment display
    path('api/users/', views.CustomUserListView.as_view(), name='user-list'), #admin usr dtials 
    
    path('api/posts/<int:pk>/delete/', views.DeletePostView.as_view(), name='delete-post'), #delete post- admin
    path('api/comments/<int:pk>/delete/',views. CommentDeleteView.as_view(), name='delete-comment'),# delete comment
    path('api/users/<int:pk>/delete/', views.DeleteUserView.as_view(), name='delete_user'),
    path('api/summary/', views.summary_view, name='summary'),  # admin home counts
    path('api/public-user-posts/<int:user_id>/', views.public_user_posts, name='public-user-posts'), #pubblic rofile

    
]


