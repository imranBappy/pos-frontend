import React from 'react';
import UserDashboard from '../../components/UserDashboard';

const page = ({ params }: { params: { userId: string } }) => {
    return (
        <UserDashboard userId={params.userId} />
    );
};

export default page;