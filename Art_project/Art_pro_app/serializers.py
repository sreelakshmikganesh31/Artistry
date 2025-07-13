from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from .models import Post, Comment

User = get_user_model()

# ========================= User Register Serializer =========================
class CustomUserRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'phone')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn’t match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


# ========================= Comment Serializer =========================
# class CommentSerializer(serializers.ModelSerializer):
#     user = serializers.StringRelatedField(read_only=True)

#     class Meta:
#         model = Comment
#         fields = ['id', 'user', 'post', 'content', 'created_at']


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    post_title = serializers.CharField(source='post.title', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'post_title', 'content', 'created_at']

# ========================= Post Serializer =========================
# class PostSerializer(serializers.ModelSerializer):
    
#     likes = serializers.SerializerMethodField()
#     comments = CommentSerializer(many=True, read_only=True)  # Added to include comments

#     class Meta:
#         model = Post
#         fields = ['id', 'title', 'description', 'image', 'created_by', 'likes', 'comments']  #Added 'comments'
#         read_only_fields = ['created_by', 'likes', 'comments']

#     def get_likes(self, obj):
#         return obj.likes.count()




class PostSerializer(serializers.ModelSerializer):
    like_count = serializers.SerializerMethodField()  # This should be inside the class
    comments = CommentSerializer(many=True, read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = Post
        fields = ['id', 'title', 'description', 'image', 'created_by', 'like_count', 'comments','created_at']
        read_only_fields = ['created_by',  'comments']

    def get_like_count(self, obj):  # This should also be inside the class
        return obj.likes.count()
   


#   fpr the admin login logicfrom rest_framework_simplejwt.serializers import TokenObtainPairSerializer
# In your serializers.py

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['is_superuser'] = user.is_superuser  # ✅ This adds to token (header payload, not response)
        token['username'] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['is_superuser'] = self.user.is_superuser  # ✅ This adds to direct response
        data['username'] = self.user.username
        return data



#  for dispaying usr deatilsas a list
from .models import CustomUser  

class CustomUserListSerializer(serializers.ModelSerializer):
    posts_created_count = serializers.IntegerField(source='posts_created.count', read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'phone', 'posts_created_count']
