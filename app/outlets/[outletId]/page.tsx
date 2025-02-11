"use client"
import withProtection from '@/HOC/ProtectedRoute';
import { ADMIN } from '@/constants/role.constants';
import OutletAddForm from '../components/forms/outlet-add-form';

const page = ({ params }: { params: { outletId: string } }) => {
    return (
        <>
            <OutletAddForm outletId={params.outletId} />
        </>
    );
};

export default withProtection(page, [ADMIN]);