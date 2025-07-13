import React from 'react';
import contactBg from '../assets/Images/color2.webp';
import '../assets/CSS/Style.css';
import Navbar from '../components/Navbar';
import { useNavigate, useLocation } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const username = location.state?.username || localStorage.getItem('username') || 'Guest';

  return (
    <>
      {/* ✅ Navbar Added */}
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

      <div
        className="contact-page"
        style={{
          backgroundImage: `url(${contactBg})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          minHeight: '100vh',
          padding: '20px'
        }}
      >
        <div className="contact-container">
          <div className="contact-title">Contact Us</div>
          <div className="contact-paragraph">
            This is a sample contact page created for display purposes in the Artistry project. You can showcase your contact details or future form here.
          </div>

          <div className="contact-info">
            <p><i className="fas fa-envelope"></i> Email: artistryproject@example.com</p>
            <p><i className="fas fa-phone"></i> Phone: +91 98765 43210</p>
            <p><i className="fas fa-map-marker-alt"></i> Address: 123 Creative Street, Art City, India</p>
            <p><i className="fas fa-globe"></i> Website: www.artistryshowcase.com</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;
