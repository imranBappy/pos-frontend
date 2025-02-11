"use client"
import { Card } from '@/components/ui/card';
import { ADMIN } from '@/constants/role.constants';
import { CategoriesDataTable } from '../components/data-table/categories';
import withProtection from '@/HOC/ProtectedRoute';

const page = () => {
    return (
        <Card className='p-4  m-4'>
            <CategoriesDataTable />
        </Card>
    );
};

export default withProtection(page, [ADMIN]);