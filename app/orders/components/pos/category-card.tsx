import { Button } from '@/components/ui/button';
import React from 'react';
interface PROPS_TYPE {
    label: string,
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined,
    onClick?: () => void
}

const CategoryCard = ({ label, variant = 'secondary', onClick }: PROPS_TYPE) => {
    return (
        <Button variant={variant} className="rounded-full capitalize" onClick={onClick}> {label} </Button>
    );
};

export default CategoryCard;