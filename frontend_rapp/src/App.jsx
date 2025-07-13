import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home'
import About from './components/About'
import Userhome from './components/Userhome'
import Userprofile from './components/Userprofile'
import Login from './components/Login'
import Register from './components/Register'
import Navbar from './components/Navbar';
import Contact from './components/Contact';
import Adminhome from './components/Adminhome';
import NewPost from './components/Newpost';
import Userdetails from './components/Userdetails';
import Postdetails from './components/Postdetails';
import Commentdetails from './components/Commentdetails';
import Public_profile from './components/Public_profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/About' element={< About/>}/>
        <Route path='/contact' element={< Contact/>}/>
        <Route path='/userhome' element={< Userhome/>}/>
        
        <Route path='/userprofile' element={< Userprofile/>}/>
         <Route path='/newpost' element={< NewPost/>}/>
        <Route path='/login' element={< Login/>}/>
        <Route path='/register' element={< Register/>}/>
        <Route path='/nav' element={< Navbar/>}/>
        <Route path='/adminhome' element={< Adminhome/>}/>
        <Route path='/userdetails' element={< Userdetails/>}/>
        <Route path='/postdetails' element={< Postdetails/>}/>
        <Route path='/comments' element={< Commentdetails/>}/>
        <Route path='/public-profile/:id' element={< Public_profile/>}/>




      </Routes>
    </BrowserRouter>
  );
}

export default App;
