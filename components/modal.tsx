import React from 'react'
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTrigger,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
} from './ui/alert-dialog';
import { X } from 'lucide-react';

export type BUTTON_VARIANT_TYPE = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
interface ModelProps {
    openBtnName: string,
    onOpen?: () => void,
    openBtnClassName?: string,
    title: string,
    description?: string,
    children: React.ReactNode,
    closeBtnName?: string,
    onClose?: () => void,
    className?: string,
    disabled?: boolean,
    variant?: BUTTON_VARIANT_TYPE,
    open?: boolean,
    isCloseBtn?: boolean,
    onOpenChange?: (value: boolean) => void;
}

export function Modal({ onOpenChange,isCloseBtn, open, children, disabled, variant = 'outline', openBtnName, openBtnClassName, title, description, onOpen, className, closeBtnName = 'Close', onClose }: ModelProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogTrigger asChild>
                <Button
                    disabled={disabled}
                    onClick={onOpen}
                    variant={variant}
                    className={`${openBtnClassName}`}
                >
                    {openBtnName}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent
                className={`md:max-w-4xl max-w-md ${className}`}
            >
                <AlertDialogHeader>
                    <div>
                        <AlertDialogTitle>{title}</AlertDialogTitle>
                        <Button
                            onClick={() => onOpenChange && onOpenChange(false)}
                            variant="ghost"
                            className="absolute top-0 right-0 mt-2 mr-2"
                        >
                            <X />
                        </Button>
                    </div>
                    <AlertDialogDescription>
                        {description || 'Are you sure you want to do this?'}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex items-center space-x-2 ">{children}</div>
                {isCloseBtn && (
                    <AlertDialogFooter className="sm:justify-start">
                        <AlertDialogCancel asChild>
                            <Button
                                type="button"
                                onClick={onClose}
                                variant="secondary"
                            >
                                {closeBtnName}
                            </Button>
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                )}
            </AlertDialogContent>
        </AlertDialog>
    );
}
export default Modal