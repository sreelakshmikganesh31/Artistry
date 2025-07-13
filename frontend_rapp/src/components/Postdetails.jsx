import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../assets/CSS/Style.css';

const Postdetails = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/posts/');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/posts/${postId}/delete/`);
        fetchPosts(); // Refresh the post list after deletion
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2 className="text-center mb-4">POSTS</h2>
        <div className="row justify-content-center">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="col-md-4 mb-4">
                <div className="card shadow post-card h-100">
                  <img src={post.image} alt="Post" className="card-img-top post-img" />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{post.title}</h5>
                    <p className="card-text mb-1"><strong>User:</strong> {post.created_by}</p>
                    <p className="card-text mb-1"><strong>Likes:</strong> {post.like_count}</p>
                    <p className="card-text mb-3">
                      <strong>Created:</strong>{' '}
                      {new Date(post.created_at).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                      })}
                    </p>
                    <button
                      className="btn btn-dark mt-auto"
                      onClick={() => handleDelete(post.id)}
                    >
                      Delete Post
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No posts available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Postdetails;
