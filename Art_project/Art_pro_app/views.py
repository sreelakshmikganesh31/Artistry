from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import CustomUser
from django.contrib.auth.hashers import make_password

@api_view(['POST'])
def RegisterAPI(request):
    data = request.data
    if data['password1'] != data['password2']:
        return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = CustomUser.objects.create(
            username=data['username'],
            email=data['email'],
            phone=data['phone'],
            password=make_password(data['password1'])  # 👈 Always hash the password
        )
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# NEW post 
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .serializers import PostSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):
    serializer = PostSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(created_by=request.user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

#  fetch posts of the currently logged-in user.
# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_user_posts(request):
#     user = request.user
#     posts = user.posts.all()  # Assuming you have related_name='posts' in Post model's created_by field
#     serializer = PostSerializer(posts, many=True)
#     return Response(serializer.data)

# user profile ,post dsplaying


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Post

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_posts(request):
    user = request.user
    posts = Post.objects.filter(created_by=user)

    post_list = []
    for post in posts:
        post_list.append({
            'id': post.id,
            'title': post.title,
            'description': post.description,
            'image': request.build_absolute_uri(post.image.url) if post.image else '',
            'like_count': post.likes.count(),
            "created_by": {
               "id": 5,
               "username": "john_doe"
             }
            
        })

    return Response(post_list)


#  delte and edit  button in userporifle foreach post
from rest_framework.generics import DestroyAPIView ,UpdateAPIView,ListCreateAPIView
from .models import Post
from .serializers import PostSerializer

class DeletePostView(DestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

class UpdatePostView(UpdateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]


# userhome   # 
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Post, Comment
from .serializers import PostSerializer, CommentSerializer

# Get All Posts
class PostListAPIView(generics.ListAPIView):
    queryset = Post.objects.all().prefetch_related('comments').order_by('-created_at')
    serializer_class = PostSerializer

# Like / Unlike Post
# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def like_post(request, post_id):
#     post = Post.objects.get(id=post_id)
#     if request.user in post.likes.all():
#         post.likes.remove(request.user)
#         liked = False
#     else:
#         post.likes.add(request.user)
#         liked = True
#     return Response({'liked': liked, 'like_count': post.likes.count()})


#  like feature
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Post

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_post(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    user = request.user

    if user in post.likes.all():
        post.likes.remove(user)
        post.like_count -= 1  # ✅ Make sure this field exists in your model
        liked = False
    else:
        post.likes.add(user)
        post.like_count += 1
        liked = True

    post.save()

    return Response({
        'liked': liked,
        'like_count': post.like_count  # ✅ Must return this exact key name
    })


# Add Comment
# views.py
from rest_framework import generics, permissions
from rest_framework.exceptions import NotFound
from .models import Comment, Post
from .serializers import CommentSerializer

class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        post_id = self.kwargs['post_id']
        return Comment.objects.filter(post_id=post_id).order_by('created_at')

    def perform_create(self, serializer):
        post_id = self.kwargs['post_id']

        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            # Raise a proper HTTP 404 error
            raise NotFound(detail="Post not found.")

        serializer.save(user=self.request.user, post=post)



# userhome like feature
# views.py
from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Comment
from .serializers import CommentSerializer

class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        post_id = self.kwargs['post_id']
        return Comment.objects.filter(post_id=post_id).order_by('created_at')

    def perform_create(self, serializer):
        post_id = self.kwargs['post_id']
        serializer.save(user=self.request.user, post_id=post_id)



# userprofile dislayes
# from .serializers import PostSerializer
# class UserPostListAPIView(generics.ListAPIView):
#     serializer_class = PostSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
        
#         return Post.objects.filter(created_by=self.request.user).order_by('-created_at')
    
#     def get_queryset(self):
#           return Post.objects.filter(created_by=self.request.user).prefetch_related('likes').order_by('-created_at')


# views.py  admin page post all view
from rest_framework.generics import RetrieveAPIView
from .models import Post
from .serializers import PostSerializer

class PostDetailView(RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

#  post delete feature
from rest_framework import generics
from .models import Post

class DeletePostView(generics.DestroyAPIView):
    queryset = Post.objects.all()
    lookup_field = 'pk'


# admin login logic
# In your views.py

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    

    def post(self, request, *args, **kwargs):
        print("Custom token view is working ✅")
        return super().post(request, *args, **kwargs)
    


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    user = request.user
    return Response({
        'username': user.username,
        'is_superuser': user.is_superuser
    })


# display all commentisi admin side
from rest_framework.generics import ListAPIView
from .models import Comment
from .serializers import CommentSerializer

class AllCommentsListView(ListAPIView):
    queryset = Comment.objects.all().order_by('-created_at')
    serializer_class = CommentSerializer

# admin comment delete
# views.py
from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Comment
from .serializers import CommentSerializer

class CommentDeleteView(generics.DestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


# displaying allt he coustom user ofr userdetials
from rest_framework.generics import ListAPIView
from .models import CustomUser
from .serializers import CustomUserListSerializer

class CustomUserListView(ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserListSerializer


# user deletion -admin
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

class DeleteUserView(APIView):
    def delete(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            user.delete()
            return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)



# admin home count of thing showing
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Post
from .models import Comment

@api_view(['GET'])
def summary_view(request):
    User = get_user_model()
    total_users = User.objects.count()
    total_posts = Post.objects.count()
    total_comments = Comment.objects.count()
    total_likes = sum(post.likes.count() for post in Post.objects.all())

    return Response({
        'total_users': total_users,
        'total_posts': total_posts,
        'total_comments': total_comments,
        'total_likes': total_likes,
    })

# public profile

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def public_user_posts(request, user_id):
    user = CustomUser.objects.get(id=user_id)
    posts = Post.objects.filter(created_by=user)

    post_list = []
    for post in posts:
        post_list.append({
            'id': post.id,
            'title': post.title,
            'description': post.description,
            'image': request.build_absolute_uri(post.image.url) if post.image else '',
        })

    return Response({
        'username': user.username,
        'posts': post_list
    })
