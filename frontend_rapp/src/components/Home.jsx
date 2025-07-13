import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Import the Navbar
import '../assets/CSS/Style.css';

// Importing all images
import cat from '../assets/Images/cat.jpeg';
import owl from '../assets/Images/owl.jpeg';
import moon from '../assets/Images/moon.jpeg';
import cardboard from '../assets/Images/cardboard.jpeg';
import work1 from '../assets/Images/work1.webp';
import work2 from '../assets/Images/work2.jpg';
import work3 from '../assets/Images/work3.webp';

const Home = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      setIsLoggedIn(false);
      navigate('/logout');
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

      {/* Content */}
      <div className="container-fluid bg-front py-5">
        <div className="row align-items-center">

          {/* Left: Image Slider */}
          <div className="col-md-6">
            <div className="slider-frame">
              <div className="slide-images">
                <div className="image-container">
                  <img src={cat} alt="Cat" />
                </div>
                <div className="image-container">
                  <img src={owl} alt="Owl" />
                </div>
                <div className="image-container">
                  <img src={moon} alt="Moon" />
                </div>
                <div className="image-container">
                  <img src={cardboard} alt="Cardboard" />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="col-md-6">
            <div className="p-4">
              <h1 className="mb-3 title" style={{ paddingBottom: '50px' }}>Artistry</h1>
              <p className="mb-0">
                Welcome to Artistry, a minimalist social portfolio platform where
                creators showcase their work through images and videos. Build your
                personal profile, share your creativity, and connect with others
                through likes and comments. Join Artistry to express your
                art and engage with a vibrant creative community.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Works Section */}
      <div className="bg2">
        <div className="bg container-fluid bg-con py-4">
          <h2 className="bg2-text mb-4 ">Works</h2>

          <div className="bg2-img">
            <div className="container" style={{ paddingLeft: '20px' }}>
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                <div className="col">
                  <img src={work1} className="img-fluid shadow bg2-imgsize" alt="Artwork 1" />
                </div>
                <div className="col">
                  <img src={work3} className="img-fluid shadow bg2-imgsize" alt="Artwork 2" />
                </div>
                <div className="col">
                  <img src={work2} className="img-fluid shadow bg2-imgsize" alt="Artwork 3" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="container-fluid" style={{ marginTop: '450px' }}>
        <div className="Home-footer">
          <div className="row">
            <div className="col-sm-6 py-5 ps-5">
              <h4>Artistry</h4>
            </div>

            <div className="col-sm-3 py-5">
              <p>+91 1125939222</p>
              <p>Artistry@gmail.com</p>
              <p>Address:</p>
            </div>

            <div className="col-sm-3 py-5">
              <p>Privacy policy</p>
              <p>Accessibility statement</p>
              <p>Terms & Conditions</p>
              <p>Shipping policy</p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
