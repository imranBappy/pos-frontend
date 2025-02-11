import React from 'react'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

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
        <Dialog
            modal={true}
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogTrigger asChild>
                <Button disabled={disabled} onClick={onOpen} variant={variant} className={`${openBtnClassName}`}>{openBtnName}</Button>
            </DialogTrigger>
            <DialogContent
                className={`md:max-w-4xl max-w-md ${className}`}
            >
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2 ">
                    {children}
                </div>
                {
                    isCloseBtn && <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button type="button" onClick={onClose} variant="secondary">
                                {closeBtnName}
                            </Button>
                        </DialogClose>
                    </DialogFooter> 
                }
              
            </DialogContent>
        </Dialog>
    )
}
export default Modal