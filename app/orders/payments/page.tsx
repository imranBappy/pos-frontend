import { Card } from '@/components/ui';
import React from 'react';
import { PaymentsDataTable } from '../components/data-table/payment';

const page = () => {
    return (
        <Card className='p-4  m-4'>
            <PaymentsDataTable />
        </Card>
    );
};

export default page;