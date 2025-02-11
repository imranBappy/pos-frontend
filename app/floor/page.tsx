"use client"
import { Card } from '@/components/ui/card';
import { ADMIN, WAITER } from '@/constants/role.constants';
import withProtection from '@/HOC/ProtectedRoute';
import React from 'react';
import { FloorsDataTable } from './components';

const page = () => {
    return (
        <Card className='p-4  m-4'>
            <FloorsDataTable />
        </Card>
    );
};

export default withProtection(page, [ADMIN, WAITER]);