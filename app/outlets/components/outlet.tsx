import Button from '@/components/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui';
import { OUTLET_TYPE } from '@/graphql/outlet/types';
import Link from 'next/link';
import React from 'react';
interface OutletProps {
    outlet: OUTLET_TYPE
}
const Outlet = ({ outlet }: OutletProps) => {
    return (
        <Card className='  w-80 md:w-96'>
            <CardHeader>
                <CardTitle>{outlet.name}</CardTitle>
                <CardDescription>{outlet.email}</CardDescription>
                <CardDescription>{outlet.phone}</CardDescription>
                <CardDescription>{outlet.address}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='flex gap-2 flex-wrap justify-between'>
                    <div className='flex flex-col justify-between gap-2'>
                        <div>
                            Employees
                        </div>
                        <div className=' font-bold text-3xl'>
                            {outlet.users?.totalCount}
                        </div>
                    </div>
                    <div className='flex flex-col justify-between gap-2'>
                        <div>
                            Orders
                        </div>
                        <div className=' font-bold text-3xl'>
                            {outlet.orders?.totalCount}
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <div className='w-full flex gap-2 justify-between'>
                    <Link className='w-full' href={`/outlets/${outlet.id}`}><Button className='w-full' variant={'outline'}>Edit</Button></Link>
                    {/* <Button className='w-full' variant={'outline'}>View</Button> */}
                </div>
            </CardFooter>
        </Card>
    );
};

export default Outlet;