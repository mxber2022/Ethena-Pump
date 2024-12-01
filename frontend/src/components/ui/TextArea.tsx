import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function TextArea({ label, className = '', disabled = false, ...props }: TextAreaProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">
        {label}
      </label>
      <textarea
        className={`
          block w-full px-4 py-3 rounded-xl
          bg-white/5
          border border-white/10
          text-white
          placeholder-gray-500
          focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20
          disabled:bg-white/5 disabled:text-gray-500 disabled:border-white/5
          transition-all duration-200
          backdrop-blur-sm
          min-h-[120px]
          resize-y
          ${className}
        `}
        disabled={disabled}
        {...props}
      />
    </div>
  );
}