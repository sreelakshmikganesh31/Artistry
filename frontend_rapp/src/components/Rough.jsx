// login page

import React from 'react';
import { Link } from 'react-router-dom';
import loginBg from '../assets/Images/log.jpg'; // Correct image path
import '../assets/CSS/Style.css'; // Your main CSS file

const Login = () => {
  return (
    <div 
      className="login-page" // Class from CSS
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div className="card-container">
        <h3 className="login-title">Login</h3>
        <form method="POST">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>

          <div className="register-link">
            <Link to="/register">Don't have an account?</Link>
          </div>

          <div className="button-container">
            <button type="submit" className="btn">Log In</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;



//  registration page

import React from 'react';
import { Link } from 'react-router-dom';
import registerBg from '../assets/Images/palete.jpg'; // Correct image path
import '../assets/CSS/Style.css'; // Main CSS file

const Register = () => {
  return (
    <div 
      className="register-page" // Class for page styling
      style={{
        backgroundImage: `url(${registerBg})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div className="form-container">
        <form method="POST">
          <fieldset>
            <legend className="form-title">Register</legend>

            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <input type="text" name="username" className="form-control" id="id_username" required />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input type="email" name="email" className="form-control" id="id_email" required />
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <input type="tel" name="phone" className="form-control" id="id_phone" required />
            </div>

            <div className="form-group">
              <label htmlFor="password1" className="form-label">Password</label>
              <input type="password" name="password1" className="form-control" id="id_password1" required />
            </div>

            <div className="form-group">
              <label htmlFor="password2" className="form-label">Confirm Password</label>
              <input type="password" name="password2" className="form-control" id="id_password2" required />
            </div>

            <div className="text-end mb-3">
              <Link to="/login" style={{ textDecoration: 'none', color: 'black', fontSize: 'smaller' }}>
                Already have an account?
              </Link>
            </div>

            <button type="submit" className="btn btn-dark w-100">Register</button>
          </fieldset>
        </form>
      </div>
    </div>
  );
}

// export default Register;


// Userprofile.jsx
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
          headers: {
            Authorization: Bearer ${token},
          },
        });
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
    setIsEditing(false);
    setEditTitle(post.title);
    setEditDescription(post.description);

    try {
      const response = await axios.get(http://localhost:8000/posts/${post.id}/comments/);
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
      await axios.delete(http://localhost:8000/api/delete-post/${selectedPost.id}/, {
        headers: { Authorization: Bearer ${token} },
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
      await axios.put(http://localhost:8000/api/update-post/${selectedPost.id}/, {
        title: editTitle,
        description: editDescription,
      }, { headers: { Authorization: Bearer ${token} } });

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
              <div key={post.id} className="post-card">
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

              <p><b>Likes:</b> {selectedPost.likes ? selectedPost.likes.length : 0}</p>

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

// export default Userprofile;



// new post
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/CSS/Style.css';

const NewPost = () => {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [previewImage, setPreviewImage] = useState();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    navigate('/userprofile');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }

    try {
      const token = localStorage.getItem('access');

      const response = await axios.post('http://127.0.0.1:8000/api/posts/create/', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      console.log('Post created:', response.data);
      alert('Post successfully created!');
      navigate('/userprofile'); // Redirect to User Profile
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      alert('Failed to create post. Please try again.');
    }
  };

  return (
    <div className="new-post-card">
      <form id="postForm" onSubmit={handleSubmit} encType="multipart/form-data">
        <h2>Create New Post</h2>

        <div className="post-content">
          <div className="image-preview">
            {previewImage ? (
              <img id="preview" src={previewImage} alt="Preview" />
            ) : (
              <div className="no-image">Image Preview</div>
            )}
          </div>

          <div className="post-details">
            <div>
              <label htmlFor="title">Title:</label>
              <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div>
              <label htmlFor="image">Select Image:</label>
              <input type="file" id="image" onChange={handleImageChange} />
            </div>

            <div>
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="5"
                required
              ></textarea>
            </div>

            <div className="buttons">
              <button type="submit" className="btn btn-success">Save</button>
              <button type="button" id="cancelBtn" className="btn btn-danger" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

// export default NewPost;


// userhome---------------------------------------------------------------------------------
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Userhome = () => {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [comments, setComments] = useState({});
  const [showCommentInput, setShowCommentInput] = useState({});
  const [newComments, setNewComments] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    axios.get('http://127.0.0.1:8000/api/posts/')
      .then(response => {
        setPosts(response.data);
        response.data.forEach(post => {
          fetchComments(post.id);
        });
      })
      .catch(error => console.error('Error fetching posts:', error));
  };

  const fetchComments = (postId) => {
    axios.get(`http://127.0.0.1:8000/api/posts/${postId}/comments/`)
      .then(response => {
        setComments(prev => ({
          ...prev,
          [postId]: response.data
        }));
      })
      .catch(error => console.error('Error fetching comments:', error));
  };

  const togglePostLike = (postId) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));

    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, likes: post.likes + (likedPosts[postId] ? -1 : 1) } : post
      )
    );
  };

  const handleCommentInput = (postId) => {
    setShowCommentInput(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleCommentChange = (postId, e) => {
    setNewComments(prev => ({
      ...prev,
      [postId]: e.target.value
    }));
  };

  const handlePostComment = (postId) => {
    if (!newComments[postId] || newComments[postId].trim() === '') return;

    const token = localStorage.getItem('access_token');

    axios.post(`http://127.0.0.1:8000/api/posts/${postId}/comments/`,  // Make sure this URL matches your `CommentListCreateView`
      { content: newComments[postId] },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(response => {
        console.log('Comment saved:', response.data);

        //  Add the new comment to the local comment list
        setComments(prev => ({
          ...prev,
          [postId]: [...(prev[postId] || []), response.data]
        }));

        //  Clear the input field
        setNewComments(prev => ({ ...prev, [postId]: '' }));

        //  Collapse the comment input box
        setShowCommentInput(prev => ({ ...prev, [postId]: false }));

      })
      .catch(error => {
        console.error('Error posting comment:', error);
      });
};


  const handleCancelComment = (postId) => {
    setNewComments(prev => ({ ...prev, [postId]: '' }));
    setShowCommentInput(prev => ({ ...prev, [postId]: false }));
  };

  const openImageModal = (imageUrl) => {
    setModalImage(imageUrl);
    setShowModal(true);
  };

  const closeImageModal = () => {
    setShowModal(false);
    setModalImage('');
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="row">
          {posts.map(post => (
            <div className="col-lg-3 col-md-6 col-sm-12 mb-4" key={post.id}>
              <div className="card post-card">
                <img
                  src={post.image || 'placeholder.png'}
                  className="card-img-top post-image"
                  alt="Post"
                  onClick={() => openImageModal(post.image)}
                />

                <div className="card-body post-content">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">{post.description}</p>

                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span
                      style={{
                        cursor: 'pointer',
                        color: likedPosts[post.id] ? 'red' : 'black',
                        fontSize: '1.5rem'
                      }}
                      onClick={() => togglePostLike(post.id)}
                    >
                      ❤️ {post.likes}
                    </span>

                    <button
                      className="btn btn-sm btn-outline-secondary"
                      style={{ width: '70px', padding: '4px' }}
                      onClick={() => handleCommentInput(post.id)}
                    >
                      Comment
                    </button>
                  </div>

                  {showCommentInput[post.id] && (
                    <div className="mt-2">
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Write your comment..."
                        value={newComments[post.id] || ''}
                        onChange={(e) => handleCommentChange(post.id, e)}
                      />
                      <div className="d-flex justify-content-between gap-2">
                        <button className="btn btn-success flex-fill" onClick={() => handlePostComment(post.id)}>Post</button>
                        <button className="btn btn-secondary flex-fill" onClick={() => handleCancelComment(post.id)}>Cancel</button>
                      </div>
                    </div>
                  )}

                  <div className="mt-3 border rounded p-2 comment-box">
                    {comments[post.id] && comments[post.id].length > 0 ? (
                      comments[post.id].map((comment, index) => (
                        <p key={index} className="mb-1"><strong>{comment.user}:</strong> {comment.content}</p>
                      ))
                    ) : (
                      <p className="text-muted">No comments yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Image Modal */}
      {showModal && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
          onClick={closeImageModal}
        >
          <img src={modalImage} alt="Full View" style={{ maxHeight: '90%', maxWidth: '90%' }} />
        </div>
      )}

      <style jsx>{`
        .post-card {
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .post-image {
          width: 100%;
          height: 250px;
          object-fit: cover;
          cursor: pointer;
        }

        .post-content {
          padding: 12px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .comment-box {
          max-height: 150px;
          overflow-y: auto;
          background: #f9f9f9;
          padding: 8px;
          border-radius: 4px;
        }

        @media (max-width: 768px) {
          .post-image {
            height: 200px;
          }
        }
      `}</style>
    </>
  );
};

// export default Userhome;


// login-------------------------------------------------------------------------------------------------
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import loginBg from '../assets/Images/log.jpg';
import '../assets/CSS/Style.css';

// const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //  Login API Call
      const response = await axios.post('http://localhost:8000/api/token/', credentials);

      //  Store tokens
      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);

      //  Store username separately if you want to use it later without passing in state
      localStorage.setItem('username', credentials.username);

      // alert('Login Successful!');

      //  Navigate to UserHome (state passing optional now because username is stored)
      navigate('/userhome', { state: { username: credentials.username } });
    } catch (error) {
      console.error(error.response.data);
      alert('Login Failed. Check your credentials.');
    }
  };

  return (
    <div
      className="login-page"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div className="card-container">
        <h3 className="login-title">Login</h3>
        <form method="POST" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" required onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required onChange={handleChange} />
          </div>

          <div className="register-link">
            <Link to="/register">Don't have an account?</Link>
          </div>

          <div className="button-container">
            <button type="submit" className="btn">Log In</button>
          </div>
        </form>
      </div>
    </div>
  );
// };

// export default Login;

