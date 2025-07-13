import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import registerBg from '../assets/Images/palete.jpg';
import '../assets/CSS/Style.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password1: '',
    password2: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/register/', formData);// API endpoint
      // alert('Registration Successful!');
      navigate('/login'); // Redirect to Login
    } catch (error) {
      console.error(error.response.data);
      alert('Registration Failed.');
    }
  };

  return (
    <div 
      className="register-page"
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
        <form method="POST" onSubmit={handleSubmit}>
          <fieldset>
            <legend className="form-title">Register</legend>

            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <input type="text" name="username" className="form-control" id="id_username" required onChange={handleChange} />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input type="email" name="email" className="form-control" id="id_email" required onChange={handleChange} />
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <input type="tel" name="phone" className="form-control" id="id_phone" required onChange={handleChange} />
            </div>

            <div className="form-group">
              <label htmlFor="password1" className="form-label">Password</label>
              <input type="password" name="password1" className="form-control" id="id_password1" required onChange={handleChange} />
            </div>

            <div className="form-group">
              <label htmlFor="password2" className="form-label">Confirm Password</label>
              <input type="password" name="password2" className="form-control" id="id_password2" required onChange={handleChange} />
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
};

export default Register;
