

import React, { useState, useEffect } from 'react';
import profilePic from '../assets/Images/idprofile.jpg';
import '../assets/CSS/Style.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Userprofile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const username = location.state?.username || localStorage.getItem('username') || 'Guest';

  const [userPosts, setUserPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const token = localStorage.getItem('access');
        const response = await axios.get('http://localhost:8000/api/user-posts/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
         console.log('API Response:', response.data);

        setUserPosts(response.data.reverse());
      } catch (error) {
        console.error('Error fetching user posts:', error);
        if (error.response && error.response.status === 401) {
          alert('Session expired. Please login again.');
          navigate('/login');
        }
      }
    };

    fetchUserPosts();
  }, [navigate]);

  const openModal = async (post) => {
    setSelectedPost(post);
    console.log('Selected Post:', post);

    setIsEditing(false);
    setEditTitle(post.title);
    setEditDescription(post.description);

    try {
      const response = await axios.get(`http://localhost:8000/api/post-comments/${post.id}/`);
      setComments(response.data);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const closeModal = () => {
    setSelectedPost(null);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('access');
      await axios.delete(`http://localhost:8000/api/delete-post/${selectedPost.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Post deleted successfully.');
      setUserPosts(userPosts.filter(post => post.id !== selectedPost.id));
      closeModal();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post.');
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('access');
      await axios.put(`http://localhost:8000/api/update-post/${selectedPost.id}/`, {
        title: editTitle,
        description: editDescription,
      }, { headers: { Authorization: `Bearer ${token}` } });

      const updatedPosts = userPosts.map(post =>
        post.id === selectedPost.id ? { ...post, title: editTitle, description: editDescription } : post
      );
      setUserPosts(updatedPosts);

      setSelectedPost(prevPost => ({
        ...prevPost,
        title: editTitle,
        description: editDescription
      }));

      alert('Post updated successfully.');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Error updating post.');
    }
  };

  return (
    <>
      <Navbar
        isLoggedIn={true}
        username={username}
        handleLogout={() => {
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          localStorage.removeItem('username');
          alert('Logged out successfully!');
          navigate('/login');
        }}
      />

      <div className="profile-page">
        <div className="profile-container">
          <div className="top-section">
            <img src={profilePic} alt="Profile" className="avatar" />
            <div className="user-info">
              <div className="username-row">
                <h1 style={{ fontSize: "50px", fontFamily: "'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif" }}>{username}</h1>
                <button
                  style={{ width: "100px", height: "50px", marginLeft: "40px" }}
                  onClick={() => navigate('/newpost')}
                  className='btn btn-dark'
                >
                  Post
                </button>
              </div>
              <div className="bio">
                <p><b>Nick Name</b> <br /><br />Description</p>
              </div>
            </div>
          </div>
        </div>

        <hr style={{ width: "100%" }} />
        <h3 style={{ textAlign: "center" }}>POSTS</h3>

        <div className="post-grid">
          {userPosts.length > 0 ? (
            userPosts.map(post => (
              <div className="post-card" key={post.id}>
                <img
                  src={post.image}
                  alt={post.title}
                  className="post-img"
                  onClick={() => openModal(post)}
                />
               
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center" }}>No posts yet.</p>
          )}
        </div>

        {selectedPost && (
          <div className="custom-modal" onClick={closeModal}>
            <div className="custom-modal-content" onClick={(e) => e.stopPropagation()}>
              <span className="custom-close-button" onClick={closeModal}>&times;</span>

              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
              />

              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="form-control my-2"
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="form-control my-2"
                  ></textarea>
                </>
              ) : (
                <>
                  <h4 className="mt-3">{selectedPost.title}</h4>
                  <p>{selectedPost.description}</p>
                </>
              )}

               {/* Like Count Display  */}
              <p style={{  marginTop: "10px" }}>
                <b>Likes:</b> {selectedPost.like_count || 0}
              </p>

              <div>
                <button
                  className="custom-action-button edit"
                  onClick={() => setIsEditing(true)}
                  style={{ display: isEditing ? 'none' : 'inline-block' }}
                >
                  Edit
                </button>

                <button
                  className="custom-action-button save"
                  onClick={handleSave}
                  style={{ display: isEditing ? 'inline-block' : 'none' }}
                >
                  Save
                </button>

                <button
                  className="custom-action-button cancel"
                  onClick={() => {
                    setEditTitle(selectedPost.title);
                    setEditDescription(selectedPost.description);
                    setIsEditing(false);
                  }}
                  style={{ display: isEditing ? 'inline-block' : 'none' }}
                >
                  Cancel
                </button>

                <button
                  className="custom-action-button delete"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this post?')) {
                      handleDelete();
                    }
                  }}
                >
                  Delete
                </button>
              </div>

              {/* ✅ Display Comments */}
              <div className="mt-4">
                <h5>Comments</h5>
                <div style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
                  {comments.length > 0 ? (
                    comments.map((comment, index) => (
                      <p key={index}><b>{comment.user}:</b> {comment.content}</p>
                    ))
                  ) : (
                    <p>No comments yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Userprofile;
