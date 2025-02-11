"use client";
import React from 'react';
import { Separator } from '@/components/ui';
import { X } from 'lucide-react';
import Button from '@/components/button';
import SearchFilter from '@/components/filters/SearchFilter';
import { OPTION_TYPE } from '@/components/input';
import useStore from '@/stores';
const ItemAddForm = ({ items }: { items: OPTION_TYPE[] }) => {
    const selectedItems = useStore((store) => store.items)
    const addItem = useStore((store) => store.addItem)
    const clearItems = useStore((store) => store.clearItems)
    const remoteItem = useStore((store) => store.remoteItem)


    return (
        <div className='mb-5'>
            <Separator />
            <div className=' flex items-center justify-between'>
                <h4 className='my-4 '>Add Item ({selectedItems.size})</h4>
                <Button onClick={clearItems} size='icon' variant='secondary' type='button' ><X /></Button>
            </div>
            <div className='flex gap-2  '>
                <SearchFilter selectedItems={selectedItems}
                    onRemove={remoteItem}
                    onSelect={addItem} items={items} placeholder='Select Item' />
            </div>
        </div>
    );
};

export default ItemAddForm;