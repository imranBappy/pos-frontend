import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui';
interface InfoCardProps {
    title: string;
    value: string;
    className?: string;
}
const InfoCard = ({
    title,
    value,
    className,
}: InfoCardProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className={`text-3xl font-semibold ${className}`}
                >{value}</p>
            </CardContent>
        </Card>
    );
}

export default InfoCard;