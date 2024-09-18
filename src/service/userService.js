import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';


const API_URL = `${API_BASE_URL}UserRestController/`;


const fetchUser = async () => {
    try {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            throw new Error('No token found. Please login.');
        }

        // Assuming you already have the decoded token stored under 'user'
        const storedUserData = localStorage.getItem('user');
        if (!storedUserData) {
            throw new Error('User data not found. Please login.');
        }

        // Parse the user data
        const userData = JSON.parse(storedUserData);
        const { email } = userData;

        if (!email) {
            throw new Error('Email is missing from user data.');
        }

        // Make the API call to fetch the user details by email

        const response = await axios.get(`${API_URL}findUserByEmail/${encodeURIComponent(email)}`, {
            headers: {
                Authorization: `Bearer ${storedToken}`
            }
        });

        if (response.status === 200) {
            console.log("Fetched user data:", response.data);
            // Store the detailed user data back into local storage
            localStorage.setItem('user', JSON.stringify(response.data));
            return response.data;
        } else {
            throw new Error('Failed to fetch user data.');
        }

    } catch (error) {
        console.error('Fetch user error:', error);
        throw error;
    }
};

const fetchUserByEmail = async (email) => {
    try {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            throw new Error('No token found. Please login.');
        }

        if (!email) {
            throw new Error('Email parameter is required.');
        }
        const response = await axios.get(`${API_URL}findUserByEmail/${encodeURIComponent(email)}`, {
            headers: {
                Authorization: `Bearer ${storedToken}`
            }
        });

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Failed to fetch user data.');
        }

    } catch (error) {
        console.error('Fetch user by email error:', error);
        throw error;
    }
};


const findUsers = async () => {
    try {
        const storedToken = localStorage.getItem('token'); // Fetch the token directly
        console.log("Token is here ",storedToken)
        if (!storedToken) {
            throw new Error('No token found. Please login.');
        }

        console.log(`${API_URL}findUsers`)
        const response = await axios.get(`${API_URL}findUsers`, {
            headers: {
                Authorization: `Bearer ${storedToken}`
            }
        });
        console.log(response)

        if (response.status === 200) {
            return response.data;
        }
        throw new Error('Failed to fetch users.');

    } catch (error) {
        console.error('Fetch users error:', error);
        throw error;
    }
};

const toggleUserStatus = async (email) => {
    try {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            throw new Error('No token found. Please login.');
        }

        const response = await axios.put(`${API_URL}toggelUser`, null, {
            params: { email: email },
            headers: {
                Authorization: `Bearer ${storedToken}`
            }
        });

        if (response.status === 200) {
            console.log("User status toggled successfully:", response.data);
            return response.data;
        } else {
            throw new Error('Failed to toggle user status.');
        }

    } catch (error) {
        console.error('Toggle user status error:', error);
        throw error;
    }
};

const updateUser = async (user) => {
    try {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            throw new Error('No token found. Please login.');
        }

        const response = await axios.put(`${API_URL}updateUser`, user, {
            headers: {
                Authorization: `Bearer ${storedToken}`
            }
        });

        if (response.status === 200) {
            console.log("User updated successfully:", response.data);

            // Update the local storage with the new user information
            localStorage.setItem('user', JSON.stringify(response.data));

            return response.data;
        } else {
            throw new Error('Failed to update user.');
        }

    } catch (error) {
        console.error('Update user error:', error);
        throw error;
    }
};



const getUserRole = () => {
    const user = JSON.parse(localStorage.getItem('user')); // assuming user info is stored in localStorage
    return user ? user.role : 'GUEST'; // default to 'GUEST' if no user or role is found
};



const changePassword = async (oldPass, newPass) => {
    try {
        // Retrieve token from local storage
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            throw new Error('No token found. Please login.');
        }

        // Retrieve user information from local storage
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            throw new Error('No user information found. Please login.');
        }

        // Parse the stored user object to extract the email
        const { email } = JSON.parse(storedUser);

        // Send a PUT request to update the password
        const response = await axios.put(`${API_URL}change-password`, {
            email,
            oldPass,
            newPass
        }, {
            headers: {
                Authorization: `Bearer ${storedToken}`
            }
        });

        // Check the response status
        if (response.status === 200) {
            console.log("Password changed successfully");
        } else {
            throw new Error('Failed to change password.');
        }

    } catch (error) {
        // Log any errors that occur
        console.error('Change password error:', error);
        throw error;
    }
};


// Method to reset password
const resetPassword = async (email, password) => {
    try {
        const response = await axios.put(`${API_URL}reset-password/${encodeURIComponent(email)}`, null, {
            params: { password }
        });

        if (response.status === 200) {
            console.log("Password reset successfully");
        } else {
            throw new Error('Failed to reset password.');
        }

    } catch (error) {
        console.error('Reset password error:', error);
        throw error;
    }
};

const sendResetPasswordEmail = async (email) => {
    try {
        const response = await axios.get(`${API_URL}SendEmail`, {
            params: { email: email }
        });
        return response.data; // Success logic here
    } catch (error) {
        // Check if the error response exists
        if (error.response) {
            const backendMessage = error.response.data?.message || `Error ${error.response.status}: ${error.response.statusText}`;
            console.error('Backend returned status code:', error.response.status);
            console.error('Error message from backend:', backendMessage);

            // Throw the backend error message to be handled by the caller
            throw new Error(backendMessage);
        } else {
            // Handle any other errors (e.g., network issues)
            console.error('Error message:', error.message);
            throw new Error('An unexpected error occurred.');
        }
    }
};


 const fetchUserById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}findUserById/${id}`);
        return response.data; // Assuming the response contains the user data
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};

export default {
    changePassword,
    resetPassword,
    fetchUser,
    findUsers,
    fetchUserByEmail,
    fetchUserById,
    toggleUserStatus,
    updateUser,
    sendResetPasswordEmail
};
