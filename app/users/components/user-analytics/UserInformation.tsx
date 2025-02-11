"use client"
import { Card, CardContent, CardHeader, CardTitle, Loading, Separator } from '@/components/ui';
import { USER_QUERY } from '@/graphql/accounts/queries';
import { useQuery } from '@apollo/client';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { useRouter } from 'next/navigation';
import React from 'react';

const UserInformation = ({ userId }: { userId: string }) => {
 
    const router = useRouter()

    const { loading: user_loading, data: user_res } = useQuery(USER_QUERY, {
        variables: {
            id: userId
        },
        skip: !userId,
        onError: (error) => {
            console.error(error);
            router.push('/users')
        }
    })
    const { user } = user_res || { user: undefined }
    const address = user_res?.user?.address?.edges[0]?.node;

    if (user_loading) return <Loading />

    return (
        <Card className="shadow-sm">
            <CardHeader className="border-b">
                <CardTitle className="text-lg tracking-tight">Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border">
                            <AvatarImage className='rounded-md' src={user?.photo || ''} />
                            <AvatarFallback>{user?.name || 'w'}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <p className="font-medium tracking-tight">{user?.name || 'Walk-in Customer'}</p>
                            <p className="text-sm text-muted-foreground">{user?.email || 'No email address'}</p>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="font-medium tracking-tight capitalize">Phone</p>
                        <p className="text-sm text-muted-foreground">{user?.phone}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="font-medium tracking-tight capitalize">Gender</p>
                        <p className="text-sm text-muted-foreground">{user?.gender?.toLowerCase()}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="font-medium tracking-tight capitalize"> Date Of Birth</p>
                        <p className="text-sm text-muted-foreground">{user?.dateOfBirth}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="font-medium tracking-tight capitalize">  Role</p>
                        <p className="text-sm text-muted-foreground capitalize">{user?.role?.name?.toLowerCase()}</p>
                    </div>
                </div>
                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-8 gap-8">
                    <div className="space-y-1">
                        <p className="font-medium tracking-tight capitalize">country</p>
                        <p className="text-sm text-muted-foreground">{address?.country || '_'}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="font-medium tracking-tight capitalize">city</p>
                        <p className="text-sm text-muted-foreground">{address?.city || '_'}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="font-medium tracking-tight capitalize"> State</p>
                        <p className="text-sm text-muted-foreground">{address?.state || '_'}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="font-medium tracking-tight capitalize"> area</p>
                        <p className="text-sm text-muted-foreground">{address?.area || '_'}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="font-medium tracking-tight capitalize">  Type</p>
                        <p className="text-sm text-muted-foreground capitalize">{address?.addressType || '_'}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="font-medium tracking-tight capitalize">  street and house</p>
                        <p className="text-sm text-muted-foreground capitalize">{address?.street || ' _ '} </p>
                    </div>
                    <div className="space-y-1">
                        <p className="font-medium tracking-tight capitalize">  house</p>
                        <p className="text-sm text-muted-foreground capitalize">{address?.house || ' _ '} </p>
                    </div>
                    <div className="space-y-1">
                        <p className="font-medium tracking-tight capitalize">  address</p>
                        <p className="text-sm text-muted-foreground capitalize">{address?.address || '_'} </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default UserInformation;