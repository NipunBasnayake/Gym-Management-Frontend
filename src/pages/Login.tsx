import { useState, useContext } from 'react'
import { Lock, Mail } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { forgotPassword, resetPassword } from '../services/auth'
import axios from 'axios'

interface InputFieldProps {
    type: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder: string
    icon?: React.ReactNode
    label: string
}

const InputField: React.FC<InputFieldProps> = ({ type, value, onChange, placeholder, icon, label }) => (
    <div className="mb-4">
        <label className="block text-slate-600 dark:text-slate-400 mb-2 text-sm font-medium">{label}</label>
        <div className="relative">
            {icon && <span className="absolute left-3 top-3 text-slate-400">{icon}</span>}
            <input
                type={type}
                value={value}
                onChange={onChange}
                className={`w-full p-2 ${icon ? 'pl-10' : ''} border rounded-lg dark:bg-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors`}
                placeholder={placeholder}
            />
        </div>
    </div>
)

interface ButtonProps {
    type?: 'button' | 'submit' | 'reset'
    onClick?: () => void
    disabled?: boolean
    loading?: boolean
    children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({ type = 'button', onClick, disabled, loading, children }) => (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        className="w-full bg-orange-500 text-white py-2 rounded-lg disabled:opacity-50 hover:bg-orange-600 transition-colors"
    >
        {loading ? 'Processing...' : children}
    </button>
)

const LinkButton: React.FC<ButtonProps> = ({ onClick, children }) => (
    <button
        type="button"
        onClick={onClick}
        className="mt-4 text-blue-600 dark:text-blue-400 text-sm hover:underline"
    >
        {children}
    </button>
)

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
        } finally {
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
            await loginUser(forgotEmail, newPassword)
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

                {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
                )}

                {!showForgotPassword && !showResetPassword && (
                    <form onSubmit={handleLogin}>
                        <InputField
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                setError('')
                            }}
                            placeholder="Enter your email"
                            icon={<Mail className="w-5 h-5" />}
                            label="Email"
                        />
                        <InputField
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setError('')
                            }}
                            placeholder="Enter your password"
                            icon={<Lock className="w-5 h-5" />}
                            label="Password"
                        />
                        <Button type="submit" disabled={loading} loading={loading}>
                            Login
                        </Button>
                        <LinkButton onClick={() => setShowForgotPassword(true)}>Forgot Password?</LinkButton>
                    </form>
                )}

                {showForgotPassword && !showResetPassword && (
                    <form onSubmit={handleForgotPassword}>
                        <InputField
                            type="email"
                            value={forgotEmail}
                            onChange={(e) => {
                                setForgotEmail(e.target.value)
                                setError('')
                            }}
                            placeholder="Enter your email"
                            icon={<Mail className="w-5 h-5" />}
                            label="Email"
                        />
                        <Button type="submit" disabled={loading} loading={loading}>
                            Send Reset Email
                        </Button>
                        <LinkButton onClick={() => setShowForgotPassword(false)}>Back to Login</LinkButton>
                    </form>
                )}

                {showResetPassword && (
                    <form onSubmit={handleResetPassword}>
                        <InputField
                            type="email"
                            value={forgotEmail}
                            onChange={(e) => {
                                setForgotEmail(e.target.value)
                                setError('')
                            }}
                            placeholder="Enter your email"
                            icon={<Mail className="w-5 h-5" />}
                            label="Email"
                        />
                        <InputField
                            type="text"
                            value={otp}
                            onChange={(e) => {
                                setOtp(e.target.value)
                                setError('')
                            }}
                            placeholder="Enter OTP"
                            label="OTP"
                        />
                        <InputField
                            type="password"
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value)
                                setError('')
                            }}
                            placeholder="Enter new password"
                            icon={<Lock className="w-5 h-5" />}
                            label="New Password"
                        />
                        <Button type="submit" disabled={loading} loading={loading}>
                            Reset Password
                        </Button>
                        <LinkButton onClick={() => setShowResetPassword(false)}>Back to Login</LinkButton>
                    </form>
                )}
            </div>
        </div>
    )
}