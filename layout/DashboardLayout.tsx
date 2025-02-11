import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import Header from "@/components/header/Header"
import MainSidebar from "@/components/sidebar/MainSidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <MainSidebar />
            <SidebarInset>
                <Header />
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}
