import type { ButtonHTMLAttributes, ReactNode } from 'react';

type AppButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'primary' | 'outline';
};

export default function AppButton({ children, variant = 'primary', className, ...props }: AppButtonProps) {
  return (
    <button
      {...props}
      className={`app-button app-button--${variant}${className ? ` ${className}` : ''}`}
    >
      {children}
    </button>
  );
}
