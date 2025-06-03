import React, {type HTMLAttributes } from 'react';

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
}

const CardContent: React.FC<CardContentProps> = ({ className = '', children, ...props }) => {
    return (
        <div
            className={`p-6 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export { CardContent };