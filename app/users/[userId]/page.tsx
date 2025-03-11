"use client"
import { UserInfoUpdateForm } from '../components/forms';
import AddressTabs from '../components/forms/Addresses';

const page = ({ params }: { params: { userId: string } }) => {
    return (
        <>
            <UserInfoUpdateForm id={params.userId} />
            <AddressTabs userId={params.userId} />
        </>
    );
};

export default page;