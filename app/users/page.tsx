"use client"
import { Card } from '@/components/ui/card';
import { UsersDataTable } from './components';

const page = () => {
    return (
        <Card className='p-5 m-5'>
            <UsersDataTable />
        </Card>
    );
};

export default page;