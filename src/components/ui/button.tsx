import React, {type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'ghost' | 'outline' | 'primary' | 'secondary';
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ variant = 'default', className = '', children, ...props }) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium';
    const variantStyles = {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        ghost: 'hover:bg-muted hover:text-muted-foreground',
        outline: 'border border-input bg-background hover:bg-muted',
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export { Button };