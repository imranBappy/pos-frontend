"use client"
import { Sidebar } from "@/components/ui/sidebar"

import MainSidebarContent from "./MainSidebarContent"
import MainSidebarHeader from "./MainSidebarHeader"
import MainSidebarFooter from "./MainSidebarFooter"

const MainSidebar = () => {
    return (
        <Sidebar variant="sidebar" side="left" collapsible="icon">
            <MainSidebarHeader />
            <MainSidebarContent />
            <MainSidebarFooter />
        </Sidebar>
    );
};

export default MainSidebar;