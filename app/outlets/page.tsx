"use client"
import { ADMIN } from '@/constants/role.constants';
import withProtection from '@/HOC/ProtectedRoute';
import Outlets from './components/outlets';

const page = () => {
    return (
        <div className='p-5 m-5'>
            <Outlets />
        </div>
    );
};

export default withProtection(page, [ADMIN]);