import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

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
  axios.get(`http://127.0.0.1:8000/api/post-comments/${postId}/`)
    .then(response => {
      setComments(prev => ({
        ...prev,
        [postId]: response.data
      }));
    })
    .catch(error => console.error('Error fetching comments:', error));
};


  const togglePostLike = async (postId) => {
  const token = localStorage.getItem('access');
  
  try {
    const response = await axios.post(
      `http://127.0.0.1:8000/api/like-post/${postId}/`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const { liked, like_count } = response.data;

    // Update likedPosts state
    setLikedPosts(prev => ({
      ...prev,
      [postId]: liked
    }));

    // Update posts state with new like count
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, likes: like_count } : post
      )
    );

  } catch (error) {
    console.error('Error liking post:', error);
    alert('Failed to like post. Please try again.');
  }
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

 const handlePostComment = async (postId) => {
  if (!newComments[postId] || newComments[postId].trim() === '') return;

  const token = localStorage.getItem('access'); // Corrected here
  console.log('Posting comment with token:', token);

  try {
          const response = await axios.post(
         `http://127.0.0.1:8000/api/post-comments/${postId}/`,
         { content: newComments[postId] },
         { headers: { Authorization: `Bearer ${token}` } }
       );

    const updatedComments = {
      ...comments,
      [postId]: [...(comments[postId] || []), response.data]
    };
    setComments(updatedComments);

    setNewComments(prev => ({ ...prev, [postId]: '' }));
    setShowCommentInput(prev => ({ ...prev, [postId]: false }));

  } catch (error) {
    console.error('Error posting comment:', error);
    alert('Failed to post comment. Please try again.');
  }
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
          {posts.map(post => 
            <div className="col-lg-3 col-md-6 col-sm-12 mb-4" key={post.id}>
              <div className="card post-card">
                <img
                  src={post.image || 'placeholder.png'}
                  className="card-img-top post-image"
                  alt="Post"
                  onClick={() => openImageModal(post.image)}
                />

                <div className="card-body post-content">
                  <Link to={`/public-profile/${post.created_by.id}`} className="card-subtitle mb-2 text-muted" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                     @{post.created_by.username}
                   </Link>

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
          )}
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

export default Userhome;
