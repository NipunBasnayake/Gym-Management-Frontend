import React from 'react'

interface ButtonProps {
    type?: 'button' | 'submit' | 'reset'
    onClick?: () => void
    disabled?: boolean
    loading?: boolean
    children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({ type = 'button', onClick, disabled, loading, children }) => (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        className="w-full bg-orange-500 text-white py-2 rounded-lg disabled:opacity-50 hover:bg-orange-600 transition-colors"
    >
        {loading ? 'Processing...' : children}
    </button>
)

export const LinkButton: React.FC<ButtonProps> = ({ onClick, children }) => (
    <button
        type="button"
        onClick={onClick}
        className="mt-4 text-blue-600 dark:text-blue-400 text-sm hover:underline"
    >
        {children}
    </button>
)
