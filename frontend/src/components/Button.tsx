import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    fullWidth = false,
    className = '',
    ...props
}) => {
    const baseStyles = "px-4 py-2 font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-slate-900 text-white hover:bg-slate-800",
        secondary: "bg-white text-slate-700 border border-gray-200 hover:bg-gray-50",
        danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
    };

    const width = fullWidth ? "w-full" : "";

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${width} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
