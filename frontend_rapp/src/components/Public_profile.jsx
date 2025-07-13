import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../assets/CSS/Style.css';
import { useParams } from 'react-router-dom';

const Public_profile = () => {
  const { id } = useParams(); // Get user ID from URL
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await axios.get(`http://localhost:8000/api/public-user-posts/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPosts(response.data.posts);
        setUsername(response.data.username);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };

    fetchUserPosts();
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>@{username}'s Profile</h2>
        <div className="row">
          {posts.length > 0 ? (
            posts.map(post => (
              <div key={post.id} className="col-lg-3 col-md-6 col-sm-12 mb-4">
                <div className="card post-card">
                  <img
                    src={post.image}
                    className="card-img-top post-image"
                    alt="Post"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{post.title}</h5>
                    <p className="card-text">{post.description}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No posts yet.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Public_profile;
