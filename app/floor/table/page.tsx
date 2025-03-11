"use client"
import { Card } from '@/components/ui/card';

import React from 'react';
import { FloorTablesDataTable } from '../components/data-table/floor-table';

const page = () => {
    return (
        <Card className='p-4  m-4'>
            <FloorTablesDataTable />
        </Card>
    );
};

export default page;