import axios from 'axios';

import { jwtDecode } from 'jwt-decode'

import { API_BASE_URL } from '../utils/constants';
import userservice from './userService';

const API_URL = API_BASE_URL;

const login = async (userData) => {
    try {
        console.log(API_URL);
        console.log(`${API_URL}auth/login`);
        const response = await axios.post(`${API_URL}auth/login`, userData);
        console.log(response)
        const { accessToken } = response.data;
        console.log(response);

        if (!accessToken) {
            throw new Error('Access token is missing in the response');
        }

        const decodedToken = jwtDecode(accessToken);
        localStorage.setItem('user', JSON.stringify(decodedToken));
        localStorage.setItem('token', accessToken);  // Store as a plain string, not JSON string
        userservice.fetchUser(userData.email)
        return response.data;
    } catch (error) {
        console.error('Login error', error);

        if (error.response) {
            const message = error.response.data.message || error.response.statusText;
            throw new Error(`Request failed with status ${error.response.status}: ${message}`);
        } else if (error.request) {
            throw new Error('No response from server. Please check your network connection.');
        } else {
            throw new Error(`Error: ${error.message}`);
        }
    }
};

const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}auth/register`, userData);
        console.log(response);
        return response.data;
    } catch (error) {
        if (error.response) {
            const statusCode = error.response.status;
            const errorMessage = error.response.data.message || error.response.data;

            if (statusCode === 400) {
                throw new Error('Bad Request. Please check your input.');
            } else if (statusCode === 409) {
                throw new Error('User already exists with this email. Please use a different email.');
            } else if (statusCode === 404) {
                throw new Error('Resource not found. Please try again.');
            } else if (statusCode === 500) {
                throw new Error('Server error. Please try again later.');
            } else {
                throw new Error(`An unexpected error occurred: ${errorMessage}`);
            }
        } else {
            throw new Error(`Network error: ${error.message}`);
        }
    }
};


const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
};



export default {
    login,
    register,
    logout
};