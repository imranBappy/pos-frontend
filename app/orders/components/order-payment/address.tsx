import React from 'react';

import { ADDRESS_TYPE, USER_TYPE } from '@/graphql/accounts/types'
import { ADDRESS_TYPES } from '@/constants/auth.constants';
import { Card } from '@/components/ui';
import { Briefcase, Edit, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
interface AddressProps {
    address: ADDRESS_TYPE,
    user: USER_TYPE
    onSelect: () => void
}

const Address = ({ address, user, onSelect }: AddressProps) => {
    
    return (
        <Card onClick={onSelect} className={`${address?.default ? 'ring-2' : ''}  pointer  w-80 rounded-sm p-3 flex flex-col gap-2`}  >
            <div className='flex gap-2 justify-between'>
                {address?.addressType === ADDRESS_TYPES.HOME ? <div className='flex gap-2 items-center'>
                    <Home />  <span className=' font-semibold'>Home</span>
                </div> :

                    <div className='flex gap-2 items-center'>
                        <Briefcase />  <span className=' font-semibold'>Office</span>
                    </div>
                }

                <Link href={`/users/${user?.id}`}>
                    <Button type='button' size='icon' variant='ghost'>
                        <Edit />
                    </Button>
                </Link>
            </div>
            {
                address?.id ? <div>
                    {`${address?.city || '-'}, ${address?.area || '-'}, ${address?.street || '-'}, ${address?.house || '-'}`}
                </div> : <Link href={`/users/${user?.id}`}>
                        <Button variant={'secondary'}>Create Address</Button>
                    </Link>
            }

        </Card>
    );
};

export default Address;