import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthGuard = ({ children, roles }) => {
    const navigate = useNavigate();

    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        return !!token;
    };

    const getUserRole = () => {
        const user = JSON.parse(localStorage.getItem('user')); // Assuming user info is stored in local storage after login
        return user ? user.role : null;
    };

    useEffect(() => {
        if (!isAuthenticated()) {
            console.log('Not authenticated, redirecting to login');
            navigate('/login');
        } else if (roles && !roles.includes(getUserRole())) {
            console.log('User does not have the required role, redirecting to unauthorized page');
            navigate('/unauthorized'); // Redirect to an unauthorized page or handle it accordingly
        }
    }, [navigate, roles]);

    return isAuthenticated() && (!roles || roles.includes(getUserRole())) ? children : null;
};

export default AuthGuard;
