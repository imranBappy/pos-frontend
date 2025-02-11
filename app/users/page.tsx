"use client"
import { Card } from '@/components/ui/card';
import { ADMIN } from '@/constants/role.constants';
import withProtection from '@/HOC/ProtectedRoute';
import { UsersDataTable } from './components';

const page = () => {
    return (
        <Card className='p-5 m-5'>
            <UsersDataTable />
        </Card>
    );
};

export default withProtection(page, [ADMIN]);