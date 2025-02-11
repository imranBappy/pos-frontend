"use client"

import { ChevronRight } from "lucide-react"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"

import {
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"

import Link from "next/link"
import getNavLink from "@/lib/getNavLink"
import { useEffect, useState } from "react"
import { usePathname } from 'next/navigation'

interface NavItem {
    title: string;
    icon?: React.ComponentType;
    url: string;
    items?: NavItem[];
    isActive?: boolean;
}

const MainSidebarContent = () => {
    const [isClient, setIsClient] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient) return <></>;
    const navlink = getNavLink()


    return (
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
                <SidebarMenu>
                    {
                        navlink?.map((item: NavItem, index: number) => (
                            item.items?.length ?
                                <Collapsible
                                    key={`${item.title}-${index}`}
                                    asChild
                                    defaultOpen={item.isActive}
                                    className="group/collapsible"

                                >
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton tooltip={item.title}>
                                                {item.icon && <item.icon />}
                                                <span>{item.title}</span>
                                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {item.items?.map((subItem: NavItem) => (
                                                    <SidebarMenuSubItem key={`${subItem.title}-${index}`}>
                                                        <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                                                            <Link href={subItem.url}>
                                                                {subItem.title}
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>

                                                ))}
                                            </SidebarMenuSub>                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                                :
                                <SidebarMenuItem key={`${item.title}-${index}`}>
                                    <SidebarMenuButton tooltip={item.title}>
                                        {item.icon && <item.icon />}
                                        <Link href={item.url}>{item.title}</Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>

                        ))
                    }
                </SidebarMenu>
            </SidebarGroup>
        </SidebarContent>
    );
};

export default MainSidebarContent;