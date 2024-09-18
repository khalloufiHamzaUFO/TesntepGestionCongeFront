import axios from 'axios';

const API_URL = 'http://localhost:8085/NotificationRestController/'; 


export const getAllNotif = async () => {
    try {
        const response = await axios.get(`${API_URL}findAll`);
        return response.data.map(notification => ({
            ...notification,
            motif: notification.demandeConge?.motif || ''
        }));
    } catch (error) {
        if (error.response) {
            throw new Error('Failed to fetch notifications. Please try again later.');
        } else {
            throw new Error(`Error: ${error.message}`);
        }
    }
};

export const getNotificationByUserId = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}getByUser/${userId}`);
        return response.data.map(notification => ({
            ...notification,
            motif: notification.demandeConge?.motif || ''
        }));
    } catch (error) {
        if (error.response) {
            throw new Error('Failed to fetch notifications for the user. Please try again later.');
        } else {
            throw new Error(`Error: ${error.message}`);
        }
    }};
