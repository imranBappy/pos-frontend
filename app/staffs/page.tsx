"use client"
import { Card } from '@/components/ui/card';
import { StaffsDataTable } from './components';

const page = () => {
    return (
        <Card className="p-5 m-5">
            <StaffsDataTable />
        </Card>
    );
};

export default page;