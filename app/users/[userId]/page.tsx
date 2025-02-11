"use client"
import { UserInfoUpdateForm } from '../components/forms';
import withProtection from '@/HOC/ProtectedRoute';
import { ADMIN } from '@/constants/role.constants';
import AddressTabs from '../components/forms/Addresses';

const page = ({ params }: { params: { userId: string } }) => {
    return (
        <>
            <UserInfoUpdateForm id={params.userId} />
            <AddressTabs userId={params.userId} />
        </>
    );
};

export default withProtection(page, [ADMIN]);