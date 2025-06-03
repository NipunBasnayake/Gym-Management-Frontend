import React, {type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
}

const Card: React.FC<CardProps> = ({ className = '', children, ...props }) => {
    return (
        <div
            className={`rounded-lg border border-border bg-card text-card-foreground shadow-sm ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export { Card };