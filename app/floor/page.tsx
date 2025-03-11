"use client"
import { Card } from '@/components/ui/card';
import React from 'react';
import { FloorsDataTable } from './components';

const page = () => {
    return (
        <Card className='p-4  m-4'>
            <FloorsDataTable />
        </Card>
    );
};

export default page