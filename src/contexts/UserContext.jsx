// src/contexts/UserContext.js
import { createContext, useState, useEffect } from 'react';

// Create the context
export const UserContext = createContext(null);

// Define the provider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Get user from localStorage if available
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        if (user) {
            // Save user to localStorage when user state changes
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
