import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export const login = async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/v1/auth/login`, { email, password })
    console.log(response.data)
    localStorage.setItem('token', response.data)
    return response.data
}

export const logout = async () => {
    await axios.post(`${API_URL}/v1/auth/logout`)
}

export const forgotPassword = async (email: string) => {
    const response = await axios.post(`${API_URL}/v1/auth/forgot-password`, { email })
    return response.data
}

export const resetPassword = async (email: string, otp: string, newPassword: string) => {
    const response = await axios.post(`${API_URL}/v1/auth/reset-password`, { email, otp, newPassword })
    return response.data
}