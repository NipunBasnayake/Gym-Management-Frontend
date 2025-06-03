import React, { createContext, useState, useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, logout } from '../services/auth'
import { toast } from 'react-toastify'
import type { AxiosError } from 'axios'

interface AuthContextType {
    isAuthenticated: boolean
    loading: boolean
    loginUser: (email: string, password: string) => Promise<void>
    logoutUser: () => Promise<void>
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    loading: true,
    loginUser: async () => {},
    logoutUser: async () => {},
})

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        setIsAuthenticated(!!token)
        setLoading(false) // done checking
    }, [])

    const loginUser = async (email: string, password: string) => {
        try {
            await login(email, password)
            setIsAuthenticated(true)
            navigate('/')
        } catch (error) {
            const err = error as AxiosError
            if (err.response && err.response.status === 401) {
                toast.error('Invalid email or password!')
            } else {
                toast.error('Something went wrong. Please try again later.')
            }
        }
    }

    const logoutUser = async () => {
        await logout()
        setIsAuthenticated(false)
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    )
}
