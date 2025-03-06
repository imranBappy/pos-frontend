import DashboardLayout from '@/layout/DashboardLayout';
import MainLayout from '@/layout/MainLayout';
import React from 'react';
const Layout = ({ children }: { children: React.ReactNode }) => {
   return (
       <MainLayout>
           <DashboardLayout>{children}</DashboardLayout>
       </MainLayout>
   );
};

export default Layout;