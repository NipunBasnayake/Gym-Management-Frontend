import axiosInstance from '../api/axiosConfig'

export const login = async (email: string, password: string) => {
    const response = await axiosInstance.post('/v1/auth/login', { email, password })
    const token = response.data.token
    localStorage.setItem('token', token)
    return token
}

export const logout = async () => {
    await axiosInstance.post('/v1/auth/logout')
    localStorage.removeItem('token')
}

export const forgotPassword = async (email: string) => {
    const response = await axiosInstance.post('/v1/auth/forgot-password', { email })
    return response.data
}

export const resetPassword = async (email: string, otp: string, newPassword: string) => {
    const response = await axiosInstance.post('/v1/auth/reset-password', {
        email,
        otp,
        newPassword,
    })
    return response.data
}
