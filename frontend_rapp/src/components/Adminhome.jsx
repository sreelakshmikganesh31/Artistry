import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import starImage from '../assets/Images/star.png';

const AdminHome = () => {
    const [counts, setCounts] = useState({
        total_users: 0,
        total_posts: 0,
        total_comments: 0,
        total_likes: 0,
    });

    useEffect(() => {
        fetchCounts();
    }, []);

    const fetchCounts = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/summary/', {
                headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
            });
            setCounts(response.data);
        } catch (error) {
            console.error('Error fetching counts:', error);
        }
    };

    return (
        <div>
            {/* Navbar */}
            <nav className="py-2 bg">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <h3 className="mb-0 ps-2">Artistry-admin panel</h3>
                        </div>
                        <div className="col-md-6">
                            <ul className="d-flex justify-content-end list-unstyled mb-0 pe-2">
                                <li className="me-3"><Link to="/adminhome" className="text-dark text-decoration-none">Home</Link></li>
                                <li className="me-3"><Link to="/userdetails" className="text-dark text-decoration-none">User details</Link></li>
                                <li className="me-3"><Link to="/postdetails" className="text-dark text-decoration-none">Post details</Link></li>
                                <li className="me-3"><Link to="/comments" className="text-dark text-decoration-none">Comments</Link></li>
                                <li><Link to="/logout" className="text-dark text-decoration-none pe-2">Logout</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Banner Image */}
            <div>
                <img src={starImage} alt="Admin Banner" style={{ height: '450px', width: '100%' }} />
            </div>

            {/* Card Section */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '50px' }}>
                {[
                    { label: 'Total users', value: counts.total_users },
                    { label: 'Posts', value: counts.total_posts },
                    { label: 'Comments', value: counts.total_comments },
                    { label: 'Likes', value: counts.total_likes },
                ].map((item, index) => (
                    <div key={index} className="col-xl-2 col-md-4 col-sm-6 mb-4" style={{ marginRight: '50px' }}>
                        <div className="card border-left-primary shadow h-100 py-2">
                            <div className="card-body">
                                <div className="row no-gutters align-items-center">
                                    <div className="col mr-2">
                                        <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                            {item.label}
                                        </div>
                                        <div className="h5 mb-0 font-weight-bold text-gray-800">{item.value}</div>
                                    </div>
                                    <div className="col-auto">
                                        <i className="fas fa-calendar fa-2x text-gray-300"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminHome;
