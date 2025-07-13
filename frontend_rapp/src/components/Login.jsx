import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import loginBg from '../assets/Images/log.jpg';
import '../assets/CSS/Style.css';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/token/', credentials);

      if (response && response.data && response.data.access && response.data.refresh) {
        localStorage.setItem('access', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);
        localStorage.setItem('username', credentials.username);

        // 👉 Fetch role from backend using access token
        const userInfo = await axios.get('http://localhost:8000/api/user/', {
          headers: { Authorization: `Bearer ${response.data.access}` }
        });

        localStorage.setItem('is_superuser', userInfo.data.is_superuser ? 'true' : 'false');

        if (userInfo.data.is_superuser) {
          navigate('/adminhome');
        } else {
          navigate('/userhome', { state: { username: credentials.username } });
        }
      } else {
        alert('Unexpected server response. Please try again.');
        console.error('Unexpected response:', response);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        console.error('Login failed:', error.response.data);
        alert('Login Failed. Check your credentials.');
      } else {
        console.error('Network or server error:', error);
        alert('Server unreachable or network issue.');
      }
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
};

export default Login;

// the correct one at below ---------------------------------------------------------------------------------------

// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import loginBg from '../assets/Images/log.jpg';
// import '../assets/CSS/Style.css';

// const Login = () => {
//   const navigate = useNavigate();
//   const [credentials, setCredentials] = useState({ username: '', password: '' });

//   const handleChange = (e) => {
//     setCredentials({ ...credentials, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   try {
//     // Login API Call
//     const response = await axios.post('http://localhost:8000/api/token/', credentials);

//     // Ensure response and tokens exist
//     if (response && response.data && response.data.access && response.data.refresh) {
//       // Store tokens
//       localStorage.setItem('access', response.data.access);
//       localStorage.setItem('refresh', response.data.refresh);

//       // Store username
//       localStorage.setItem('username', credentials.username);

//       // Navigate to UserHome
//       navigate('/userhome', { state: { username: credentials.username } });
//     } else {
//       alert('Unexpected server response. Please try again.');
//       console.error('Unexpected response:', response);
//     }
//   } catch (error) {
//     // If the server is unreachable or response is malformed
//     if (error.response && error.response.data) {
//       console.error('Login failed:', error.response.data);
//       alert('Login Failed. Check your credentials.');
//     } else {
//       console.error('Network or server error:', error);
//       alert('Server unreachable or network issue.');
//     }
//   }
// };

//   return (
//     <div
//       className="login-page"
//       style={{
//         backgroundImage: `url(${loginBg})`,
//         backgroundSize: 'cover',
//         backgroundRepeat: 'no-repeat',
//         backgroundPosition: 'center',
//         minHeight: '100vh',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center'
//       }}
//     >
//       <div className="card-container">
//         <h3 className="login-title">Login</h3>
//         <form method="POST" onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="username">Username</label>
//             <input type="text" id="username" name="username" required onChange={handleChange} />
//           </div>

//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <input type="password" id="password" name="password" required onChange={handleChange} />
//           </div>

//           <div className="register-link">
//             <Link to="/register">Don't have an account?</Link>
//           </div>

//           <div className="button-container">
//             <button type="submit" className="btn">Log In</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

