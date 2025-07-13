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

export default NewPost;
