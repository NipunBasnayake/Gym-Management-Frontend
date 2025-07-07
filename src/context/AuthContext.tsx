import { createContext, useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, logout } from '../services/auth'
import axios from 'axios'

interface AuthContextType {
    isAuthenticated: boolean
    loginUser: (email: string, password: string) => Promise<void>
    logoutUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    loginUser: async () => {},
    logoutUser: async () => {},
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            setIsAuthenticated(true)
        }

        // 🔁 Axios interceptor for expired token handling
        const responseInterceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response?.status === 401) {
                    // Token is invalid or expired
                    await logoutUser()
                }
                return Promise.reject(error)
            }
        )

        setLoading(false)

        return () => {
            axios.interceptors.response.eject(responseInterceptor)
        }
    }, [])

    const loginUser = async (email: string, password: string) => {
        try {
            const data = await login(email, password)
            if (data?.token) {
                localStorage.setItem('token', data.token)
                axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
                setIsAuthenticated(true)
                navigate('/')
            }
        } catch (err) {
            console.error('Login error:', err)
            throw err
        }
    }

    const logoutUser = async () => {
        try {
            await logout()
        } catch (err) {
            console.error('Logout error:', err)
        } finally {
            localStorage.removeItem('token')
            delete axios.defaults.headers.common['Authorization']
            setIsAuthenticated(false)
            navigate('/login') // 👈 Redirect to log in screen
        }
    }

    if (loading) return <div>Loading...</div>

    return (
        <AuthContext.Provider value={{ isAuthenticated, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    )
}
