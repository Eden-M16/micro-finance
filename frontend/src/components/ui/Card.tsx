import React from "react";

export const Card = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <div className={`card ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <div className={`card-header ${className}`}>{children}</div>
);

export const CardTitle = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <h3 className={`card-title ${className}`}>{children}</h3>
);

export const CardContent = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <div className={`card-content ${className}`}>{children}</div>
);

export const CardFooter = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <div className={`card-footer ${className}`} style={{ padding: '1.5rem', paddingTop: 0, display: 'flex', alignItems: 'center' }}>
    {children}
  </div>
);
