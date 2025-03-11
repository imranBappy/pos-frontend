"use client"
import { Card } from '@/components/ui/card';
import { CategoriesDataTable } from '../components/data-table/categories';

const page = () => {
    return (
        <Card className='p-4  m-4'>
            <CategoriesDataTable />
        </Card>
    );
};

export default page;