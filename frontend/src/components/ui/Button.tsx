import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    const classNames = [
      "btn",
      `btn-${variant}`,
      `btn-${size}`,
      className
    ].join(" ").trim();

    return (
      <button
        ref={ref}
        className={classNames}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <span className="loader" style={{ marginRight: '8px' }}></span>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
