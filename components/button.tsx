
import React from 'react';
import { Button as BTN } from './ui/button';
import { Loader2 } from 'lucide-react';

interface PropsType {
    children: string | React.ReactNode;
    onClick?: ()=>void;
    className?: string;
    disabled?: boolean;
    isLoading?: boolean;
    type?: "button" | "submit" | "reset";
    size?: 'default' | 'sm' | 'lg' | 'icon';
    variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
}

export const Button = ({ children, onClick, className, disabled, isLoading, type, variant,size }: PropsType) => {
    return (
        <BTN
            onClick={onClick}
            className={className}
            disabled={disabled || isLoading}
            aria-disabled={disabled || isLoading}
            type={type}
            variant={variant}
            size={size}

        >
            {
                isLoading ?
                    <div className='flex items-center justify-center
                        min-w-14
                    '>
                        <Loader2 className='w-4 h-4 animate-spin' />
                    </div>
                    : children
            }

        </BTN>
    );
};

export default Button;