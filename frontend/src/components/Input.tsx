import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium text-slate-700">
                {label}
            </label>
            <input
                className={`px-3 py-2 bg-white border rounded-lg outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all ${error ? 'border-red-500' : 'border-gray-200'
                    } ${className}`}
                {...props}
            />
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
};

export default Input;
