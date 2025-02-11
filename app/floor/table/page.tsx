"use client"
import { Card } from '@/components/ui/card';
import { ADMIN } from '@/constants/role.constants';
import withProtection from '@/HOC/ProtectedRoute';
import React from 'react';
import { FloorTablesDataTable } from '../components/data-table/floor-table';

const page = () => {
    return (
        <Card className='p-4  m-4'>
            <FloorTablesDataTable />
        </Card>
    );
};

export default withProtection(page, [ADMIN]);