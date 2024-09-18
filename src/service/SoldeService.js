import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';


const API_URL = `${API_BASE_URL}SoldeCongeRestController/`;

export const getSoldeByUser = async (uid) => {
    try {
        const token = localStorage.getItem('token'); // Assuming token is stored in local storage
        console.log(`${API_URL}getSoldeByUser/${uid}`);

        const response = await axios.get(`${API_URL}getSoldeByUser/${uid}`, {
            headers: {
                'Authorization': `Bearer ${token}`, // Attach token here
            }
        });
        return response.data; // Return the SoldeConge data
    } catch (error) {
        console.error('Error fetching solde by user:', error);
        throw error; // Handle error and rethrow it
    }
};
