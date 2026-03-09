import axios from "axios";

const BASE_URL = "https://visitor-app-backend.onrender.com/api";


export const checkInVisitor = async (payload) => {
    try {
        const response = await axios.post(`${BASE_URL}/visitors/checkin`, payload, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const checkOutVisitor = async (id) => {
    try {
        const response = await axios.put(`${BASE_URL}/visitors/${id}/checkout`, null, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getWaitingVisitors = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/visitors/waiting`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};