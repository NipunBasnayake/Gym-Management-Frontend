import React, {createContext, useState, useEffect, type ReactNode} from 'react'
import {useNavigate} from 'react-router-dom'
import {login, logout} from '../services/auth'

interface AuthContextType {
    isAuthenticated: boolean
    loginUser: (email: string, password: string) => Promise<void>
    logoutUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    loginUser: async () => {
    },
    logoutUser: async () => {
    },
})

export const AuthProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const navigate = useNavigate()

    useEffect(() => {
        // Check for existing token or session
        const token = localStorage.getItem('token')
        setIsAuthenticated(!!token)
    }, [])

    const loginUser = async (email: string, password: string) => {
        try {
            await login(email, password)
            setIsAuthenticated(true)
            navigate('/')
        } catch (error) {
            console.log(error)
        }
    }

    const logoutUser = async () => {
        try {
            await logout()
            setIsAuthenticated(false)
            localStorage.removeItem('token')
            navigate('/login')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <AuthContext.Provider value={{isAuthenticated, loginUser, logoutUser}}>
            {children}
        </AuthContext.Provider>
    )
}