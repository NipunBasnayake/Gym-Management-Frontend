import { useState, useContext } from 'react'
import { Lock, Mail } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { forgotPassword, resetPassword } from '../services/auth'
import axios from "axios";

export default function Login() {
    const { loginUser } = useContext(AuthContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [forgotEmail, setForgotEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showForgotPassword, setShowForgotPassword] = useState(false)
    const [showResetPassword, setShowResetPassword] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !password) {
            setError('Email and password are required')
            return
        }
        try {
            setLoading(true)
            await loginUser(email, password)
        } catch (err: unknown) {
            console.error(err)
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                setError(err.response.data.message)
            } else {
                setError('Invalid credentials')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!forgotEmail) {
            setError('Email is required')
            return
        }
        try {
            setLoading(true)
            await forgotPassword(forgotEmail)
            setShowForgotPassword(false)
            setShowResetPassword(true)
        } catch (err: unknown) {
            console.error(err)
            if (err instanceof Error) {
                setError(err.message)
            } else {
                setError('An unexpected error occurred')
            }
        }
        finally {
            setLoading(false)
        }
    }

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!forgotEmail || !otp || !newPassword) {
            setError('All fields are required')
            return
        }
        try {
            setLoading(true)
            await resetPassword(forgotEmail, otp, newPassword)
            setShowResetPassword(false)
            setEmail(forgotEmail)
            setPassword(newPassword)
            await loginUser(forgotEmail, newPassword) // Optional: Auto-login after reset
        } catch (err: unknown) {
            console.error(err)
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                setError(err.response.data.message)
            } else {
                setError('Failed to reset password')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6 text-center">
                    {showResetPassword ? 'Reset Password' : showForgotPassword ? 'Forgot Password' : 'Login'}
                </h1>

                {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">{error}</div>}

                {!showForgotPassword && !showResetPassword && (
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block text-slate-600 dark:text-slate-400 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute w-5 h-5 text-slate-400 top-3 left-3" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        setError('')
                                    }}
                                    className="w-full p-2 pl-10 border rounded-lg dark:bg-slate-700 dark:text-slate-200"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-slate-600 dark:text-slate-400 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute w-5 h-5 text-slate-400 top-3 left-3" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                        setError('')
                                    }}
                                    className="w-full p-2 pl-10 border rounded-lg dark:bg-slate-700 dark:text-slate-200"
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-500 text-white py-2 rounded-lg disabled:opacity-50"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowForgotPassword(true)
                                setError('')
                            }}
                            className="mt-4 text-blue-600 dark:text-blue-400 text-sm"
                        >
                            Forgot Password?
                        </button>
                    </form>
                )}

                {showForgotPassword && !showResetPassword && (
                    <form onSubmit={handleForgotPassword}>
                        <div className="mb-4">
                            <label className="block text-slate-600 dark:text-slate-400 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute w-5 h-5 text-slate-400 top-3 left-3" />
                                <input
                                    type="email"
                                    value={forgotEmail}
                                    onChange={(e) => {
                                        setForgotEmail(e.target.value)
                                        setError('')
                                    }}
                                    className="w-full p-2 pl-10 border rounded-lg dark:bg-slate-700 dark:text-slate-200"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-500 text-white py-2 rounded-lg disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : 'Send Reset Email'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowForgotPassword(false)
                                setError('')
                            }}
                            className="mt-4 text-blue-600 dark:text-blue-400 text-sm"
                        >
                            Back to Login
                        </button>
                    </form>
                )}

                {showResetPassword && (
                    <form onSubmit={handleResetPassword}>
                        <div className="mb-4">
                            <label className="block text-slate-600 dark:text-slate-400 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute w-5 h-5 text-slate-400 top-3 left-3" />
                                <input
                                    type="email"
                                    value={forgotEmail}
                                    onChange={(e) => {
                                        setForgotEmail(e.target.value)
                                        setError('')
                                    }}
                                    className="w-full p-2 pl-10 border rounded-lg dark:bg-slate-700 dark:text-slate-200"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-slate-600 dark:text-slate-400 mb-2">OTP</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => {
                                    setOtp(e.target.value)
                                    setError('')
                                }}
                                className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:text-slate-200"
                                placeholder="Enter OTP"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-slate-600 dark:text-slate-400 mb-2">New Password</label>
                            <div className="relative">
                                <Lock className="absolute w-5 h-5 text-slate-400 top-3 left-3" />
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => {
                                        setNewPassword(e.target.value)
                                        setError('')
                                    }}
                                    className="w-full p-2 pl-10 border rounded-lg dark:bg-slate-700 dark:text-slate-200"
                                    placeholder="Enter new password"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-500 text-white py-2 rounded-lg disabled:opacity-50"
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowResetPassword(false)
                                setError('')
                            }}
                            className="mt-4 text-blue-600 dark:text-blue-400 text-sm"
                        >
                            Back to Login
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
