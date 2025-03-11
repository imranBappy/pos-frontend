"use client"
import { Card } from '@/components/ui/card';
import React from 'react';
import { ProductsDataTable } from './components/data-table/products';

const page = () => {
    return (
        <Card className='p-4  m-4'>
            <ProductsDataTable />
        </Card>
    );
};

export default page;