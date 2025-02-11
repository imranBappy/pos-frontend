"use client"
import {
    ChevronsUpDown,
    Plus,
} from "lucide-react"


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import useStore from "@/stores"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { ADMIN } from "@/constants/role.constants"
import Link from "next/link"


const MainSidebarHeader = () => {
    const outlets = useStore((store) => store.outlets)
    const selectOutlet = useStore((store) => store.selectOutlet)
    const activeOutlet = outlets[0]
    const role = useStore((store) => store.role)


    return (
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu >
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton

                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                                <div className="flex aspect-square size-8 items-center justify-center rounded bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Avatar className="h-8 w-8 rounded">
                                        <AvatarImage
                                            src={''}
                                            alt={activeOutlet?.name || ''}
                                        />
                                        <AvatarFallback className="rounded">
                                            O
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {activeOutlet?.name || ''}
                                    </span>
                                    <span className="truncate text-xs">
                                        {activeOutlet?.email || ''}
                                    </span>
                                </div>
                                <ChevronsUpDown className="ml-auto" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                            align="start"
                            side="bottom"
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className="text-xs text-muted-foreground">
                                Branch
                            </DropdownMenuLabel>
                            {outlets.map((item, index) => (
                                <DropdownMenuItem
                                    key={`${item?.id}-${index}`}
                                    onClick={() => selectOutlet(item.id)}
                                    className="gap-2 p-2"
                                >
                                    <div className="flex size-6 items-center justify-center rounded-sm border">
                                        <Avatar className="h-7 w-7 rounded">
                                            <AvatarImage
                                                src={''}
                                                alt={item?.name || ''}
                                            />
                                            <AvatarFallback className="rounded">
                                                O
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    {item?.name || ''}
                                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem disabled={role !== ADMIN} >
                                <Link className="flex gap-2 p-1" href={`/outlets/add`}>
                                    <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                        <Plus className="size-4" />
                                    </div>
                                    <div className="font-medium text-muted-foreground">
                                        Add Branch
                                    </div>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>
    );
};

export default MainSidebarHeader;