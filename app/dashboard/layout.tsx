import DashboardLayout from '@/layout/DashboardLayout';
import MainLayout from '@/layout/MainLayout';
import { getSession } from 'next-auth/react';
import React from 'react';
const Layout = async ({ children }: { children: React.ReactNode }) => {
    const session = await getSession();
    return (
        <MainLayout session={session}>
            <DashboardLayout>{children}</DashboardLayout>
        </MainLayout>
    );
};

export default Layout;
