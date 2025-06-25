import axios from 'axios'
import type {Member, Notification, Payment} from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3500/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Member API
export const addMember = async (member: Member) => {
    const response = await api.post('/v1/member', member)
    return response.data
}

export const getMembers = async () => {
    const response = await api.get('/v1/member')
    return response.data
}

export const getMemberById = async (id: string) => {
    const response = await api.get(`/v1/member/${id}`)
    return response.data
}

export const updateMember = async (id: string, member: Member) => {
    const response = await api.put(`/v1/member/${id}`, member)
    return response.data
}

export const deactivateMember = async (id: string) => {
    const response = await api.put(`/v1/member/${id}/deactivate`)
    return response.data
}

export const activateMember = async (id: string) => {
    const response = await api.put(`/v1/member/${id}/activate`)
    return response.data
}

// Attendance API
export const addAttendance = async (memberId: string) => {
    const response = await api.post(`/v1/attendance/scan/${memberId}`);
    return response.data;
};

export const getAttendances = async () => {
    const response = await api.get('/v1/attendance');
    return response.data;
};

export const getAttendanceByMemberId = async (memberId: string) => {
    const response = await api.get(`/v1/attendance/member/${memberId}`);
    return response.data;
};

// Notification API
export const addNotification = async (notification: Notification) => {
    const response = await api.post('/v1/notification', notification)
    return response.data
}

export const getNotifications = async () => {
    const response = await api.get('/v1/notification')
    return response.data
}

export const markNotificationAsRead = async (id: string) => {
    const response = await api.put(`/v1/notification/${id}/mark-as-read`)
    return response.data
}

export const deleteNotification = async (id: string) => {
    const response = await api.delete(`/v1/notification/${id}`)
    return response.data
}

// Payment API
export const addPayment = async (payment: Payment) => {
    const response = await api.post('/v1/payment', payment);
    return response.data;
};

export const getPayments = async () => {
    const response = await api.get('/v1/payment');
    return response.data;
};

export const updatePayment = async (id: string, payment: Payment) => {
    const response = await api.put(`/v1/payment/${id}`, payment);
    return response.data;
};
