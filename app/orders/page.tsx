"use client"
import { Card } from '@/components/ui/card';
import { ADMIN, WAITER } from '@/constants/role.constants';
import withProtection from '@/HOC/ProtectedRoute';
import React from 'react';
import { OrdersDataTable } from './components/data-table/orders';

const page = () => {
    return (
        <Card className='p-4  m-4'>
            <OrdersDataTable />
        </Card>
    );
};

export default withProtection(page, [ADMIN, WAITER]);