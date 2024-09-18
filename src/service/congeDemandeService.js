import axios from 'axios';

const API_URL = 'http://localhost:8085/DemandeRestController/';

const getToken = () => localStorage.getItem('token');

const createAxiosInstance = () => {
    return axios.create({
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    }); 
};

export const getAllConges = async () => {
    try {
        const response = await createAxiosInstance().get(`${API_URL}findAll`);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error('Failed to fetch conges. Please try again later.');
        } else {
            throw new Error(`Error: ${error.message}`);
        }
    }
};

export const addDemandeDeConge = async (formData, userId) => {
    try {
        const response = await createAxiosInstance().post(`${API_URL}create/${userId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Request successful:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error in addDemandeDeConge:', error.response ? error.response.data : error.message);
        
        // Check for 406 status code (insufficient leave balance)
        if (error.response && error.response.status === 406) {
            throw new Error('Insufficient leave balance');
        }
        
        // For other errors, return a generic message
        throw new Error('Failed to add leave request. Please try again later.');
    }
};



export const editDemandeDeConge = async (id, demandeDeConge) => {
    try {
        const response = await createAxiosInstance().put(`${API_URL}edit/${id}`, demandeDeConge);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        const statusCode = error.response?.status;
        console.error(`Error in editDemandeDeConge (Status: ${statusCode}): ${errorMessage}`);
        
        if (statusCode === 404) {
            throw new Error('The requested leave request was not found.');
        } else if (statusCode === 400) {
            throw new Error('Invalid leave request details.');
        } else {
            throw new Error(`Failed to edit leave request. Status code: ${statusCode}. ${errorMessage}`);
        }
    }
};

export const deleteDemandeDeCongeById = async (id) => {
    try {
        await createAxiosInstance().delete(`${API_URL}deleteById/${id}`);
    } catch (error) {
        throw new Error('Failed to delete demande. Please try again later.');
    }
};
export const updateDemandeDeCongeStatus = async (id, status, justification) => {
    try {
        const response = await createAxiosInstance().put(
            `${API_URL}update-status/${id}`, 
            { status, justification }
        );
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(`Failed to update status. ${error.response.data}`);
        } else {
            throw new Error(`Error: ${error.message}`);
        }
    }
};



export const getDemandeDeCongeById = async (id) => {
    try {
        const response = await createAxiosInstance().get(`${API_URL}findById/${id}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch conge by id:', error);
        throw error;
    }
};
// by wiwi
export const findAllDemandsByUser = async (userId) => {
    const response = await createAxiosInstance().get(`${API_URL}findByUser/${userId}`);
    console.log(response.data);
    return response.data;
};

