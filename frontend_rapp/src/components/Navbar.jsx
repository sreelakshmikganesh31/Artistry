import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/CSS/Style.css';

const Navbar = () => {
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem('access');
  const isAdmin = localStorage.getItem('is_superuser') === 'true'; // ✅ Must compare as string
  const username = localStorage.getItem('username');

  const logoutHandler = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('username');
    localStorage.removeItem('is_superuser');
    alert('Logged out successfully!');
    navigate('/');
  };

  return (
    <nav className="py-2 bg">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h2 className="mb-0 ps-2">Artistry</h2>
          </div>

          <div className="col-md-6">
            <ul className="d-flex justify-content-end list-unstyled mb-0 pe-2">
              {/* Common Home Link */}
              <li className="me-3">
                <Link to="/" className="text-dark text-decoration-none">Home</Link>
              </li>

              {/* Pre-login Links */}
              {!isLoggedIn && (
                <>
                  <li className="me-3">
                    <Link to="/about" className="text-dark text-decoration-none">About</Link>
                  </li>
                  <li className="me-3">
                    <Link to="/contact" className="text-dark text-decoration-none">Contact</Link>
                  </li>
                  <li className="me-3">
                    <Link to="/login" className="text-dark text-decoration-none">Login</Link>
                  </li>
                  <li>
                    <Link to="/register" className="text-dark text-decoration-none"><b>Sign up</b></Link>
                  </li>
                </>
              )}

              {/* Admin Links */}
              {isLoggedIn && isAdmin && (
                <>
                  <li className="me-3">
                    <Link to="/adminhome" className="text-dark text-decoration-none">Your Home</Link>
                  </li>
                  <li className="me-3">
                    <Link to="/postdetails" className="text-dark text-decoration-none">Post Details</Link>
                  </li>
                  <li className="me-3">
                    <Link to="/userdetails" className="text-dark text-decoration-none">User Details</Link>
                  </li>
                  <li className="me-3">
                    <Link to="/comments" className="text-dark text-decoration-none">Comment Details</Link>
                  </li>
                  <li>
                    <span onClick={logoutHandler} className="text-dark text-decoration-none pe-2" style={{ cursor: 'pointer' }}>Logout</span>
                  </li>
                </>
              )}

              {/* User Links */}
              {isLoggedIn && !isAdmin && (
                <>
                  <li className="me-3">
                    <Link to="/userhome" className="text-dark text-decoration-none">Explore</Link>
                  </li>
                  <li className="me-3">
                    <span
                      onClick={() => navigate('/userprofile', { state: { username } })}
                      className="text-dark text-decoration-none"
                      style={{ cursor: 'pointer' }}
                    >
                      Profile
                    </span>
                  </li>
                  <li>
                    <span onClick={logoutHandler} className="text-dark text-decoration-none pe-2" style={{ cursor: 'pointer' }}>Logout</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


// --------------------the right onedown there ws above in ligin-------------

// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import '../assets/CSS/Style.css';

// const Navbar = () => {
//   const navigate = useNavigate();

//   // Check login status from localStorage directly
//   const isLoggedIn = !!localStorage.getItem('access');
//   const username = localStorage.getItem('username');

//   const logoutHandler = () => {
//     localStorage.removeItem('access');
//     localStorage.removeItem('refresh');
//     localStorage.removeItem('username');
//     alert('Logged out successfully!');
//     navigate('/'); // Redirect to Home page
//   };

//   return (
//     <nav className="py-2 bg">
//       <div className="container">
//         <div className="row align-items-center">
//           <div className="col-md-6">
//             <h2 className="mb-0 ps-2">Artistry</h2>
//           </div>

//           <div className="col-md-6">
//             <ul className="d-flex justify-content-end list-unstyled mb-0 pe-2">
//               <li className="me-3">
//                 <Link to="/" className="text-dark text-decoration-none">Home</Link>
//               </li>
//               <li className="me-3">
//                 <Link to="/about" className="text-dark text-decoration-none">About</Link>
//               </li>
//               <li className="me-3">
//                 <Link to="/contact" className="text-dark text-decoration-none">Contact</Link>
//               </li>

//               {isLoggedIn ? (
//                 <>
//                   <li className="me-3">
//                     <span
//                       onClick={() => navigate('/userprofile', { state: { username } })}
//                       className="text-dark text-decoration-none"
//                       style={{ cursor: 'pointer' }}
//                     >
//                       Profile
//                     </span>
//                   </li>

//                   <li className="me-3">
//                     <Link to="/userhome" className="text-dark text-decoration-none">Explore</Link>
//                   </li>

//                   <li>
//                     <span
//                       onClick={logoutHandler}
//                       className="text-dark text-decoration-none pe-2"
//                       style={{ cursor: 'pointer' }}
//                     >
//                       Logout
//                     </span>
//                   </li>
//                 </>
//               ) : (
//                 <>
//                   <li className="me-3">
//                     <Link to="/login" className="text-dark text-decoration-none">Login</Link>
//                   </li>
//                   <li>
//                     <Link to="/register" className="text-dark text-decoration-none"><b>Sign up</b></Link>
//                   </li>
//                 </>
//               )}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
