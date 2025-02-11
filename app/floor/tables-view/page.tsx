"use client"
import TableView from '../components/table-view';
import withProtection from '@/HOC/ProtectedRoute';
import { ADMIN, WAITER } from '@/constants/role.constants';

const page = () => {
    return (
        <div className=" flex p-4 items-center justify-center  ">
            <TableView />
        </div>
    );
};

export default withProtection(page, [ADMIN, WAITER]);