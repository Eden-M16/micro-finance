import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, ...props }, ref) => {
    return (
      <div className="input-wrapper">
        {label && <label className="input-label">{label}</label>}
        <input
          ref={ref}
          className={`input-field ${className}`}
          style={error ? { borderColor: '#EF3340', boxShadow: '0 0 0 4px rgba(239, 51, 64, 0.1)' } : {}}
          {...props}
        />
        {error && <p className="error-text" style={{ fontSize: '0.75rem', color: '#EF3340', marginLeft: '0.25rem' }}>{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
