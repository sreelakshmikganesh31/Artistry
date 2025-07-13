import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../assets/CSS/Style.css';

const Commentdetails = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/comments/');
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleDelete = async (commentId) => {
  if (window.confirm('Are you sure you want to delete this comment?')) {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/comments/${commentId}/delete/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
      });
      // ✅ Instantly remove the comment from state without refetching
      setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  }
};


  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h3 className="text-center mb-4">🗒️ Comment Review</h3>
        <div className="table-responsive">
          <table className="table table-striped table-hover shadow-sm rounded text-center align-middle">
            <thead className="table-secondary">
              <tr>
                <th style={{ width: '10%' }}>ID</th>
                <th style={{ width: '20%' }}>Post</th>
                <th style={{ width: '30%' }}>Comment</th>
                <th style={{ width: '20%' }}>User</th>
                <th style={{ width: '20%' }}>Date</th>
                <th style={{ width: '10%' }}>Manage</th>
              </tr>
            </thead>
            <tbody>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <tr key={comment.id}>
                    <td>{comment.id}</td>
                    <td>{comment.post_title}</td>
                    <td>{comment.content}</td>
                    <td>{comment.user}</td>
                    <td>{new Date(comment.created_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true
                    })}</td>
                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(comment.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No comments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Commentdetails;
