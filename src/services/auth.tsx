import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export const login = async (email: string, password: string) => {
    const res = await axios.post(`${API_URL}/v1/auth/login`, { email, password })
    const token = res.data.token
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    return res.data
}

export const logout = async () => {
    await axios.post(`${API_URL}/v1/auth/logout`)
}

export const forgotPassword = async (email: string) => {
    const res = await axios.post(`${API_URL}/v1/auth/forgot-password`, { email })
    return res.data
}

export const resetPassword = async (email: string, otp: string, newPassword: string) => {
    const res = await axios.post(`${API_URL}/v1/auth/reset-password`, { email, otp, newPassword })
    return res.data
}
