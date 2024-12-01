import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

export function Input({ label, icon, className = '', disabled = false, ...props }: InputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={`
            block w-full rounded-xl
            bg-white/5 
            border border-white/10
            text-white
            placeholder-gray-500
            ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3
            focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20
            disabled:bg-white/5 disabled:text-gray-500 disabled:border-white/5
            transition-all duration-200
            backdrop-blur-sm
            ${className}
          `}
          disabled={disabled}
          {...props}
        />
      </div>
    </div>
  );
}