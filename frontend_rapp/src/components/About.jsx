import React from 'react';
import aboutBg from '../assets/Images/color2.webp';
import '../assets/CSS/Style.css';
import Navbar from '../components/Navbar';
import { useNavigate, useLocation } from 'react-router-dom';

const About = () => {
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
        className="about-page"
        style={{
          backgroundImage: `url(${aboutBg})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          minHeight: '100vh',
          padding: '20px'
        }}
      >
        <div className="about-container">
          <div className="about-title">About Artistry</div>
          <div className="about-paragraph">
            Artistry is a dynamic social-style portfolio platform that allows users to create profiles, showcase their creative works, and engage with a vibrant community. The application enables users to post, like, comment, and save artwork, fostering meaningful interactions similar to popular social media platforms.
            <br /><br />
            Artistry also supports optional sales features where users can list items for bidding, creating exciting opportunities for artists to monetize their work.
            <br /><br />
            <strong>Future Enhancements:</strong>
            <ul className="feature-list">
              <li>User profile editing and detailed profile display.</li>
              <li>Post-sharing options to expand reach.</li>
              <li>Real-time chat system for instant communication.</li>
              <li>Customizable user themes for personal branding.</li>
              <li>Advanced search filters for better content discovery.</li>
              <li>Enhanced privacy settings and user controls.</li>
              <li>Push notifications for updates and interactions.</li>
              <li>Story-style temporary posts for quick sharing.</li>
            </ul>
            <br />
            Artistry aspires to become a creative hub where artists and art lovers can freely connect, collaborate, and grow together.
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
