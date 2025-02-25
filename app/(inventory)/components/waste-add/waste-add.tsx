'use client';
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import Button from '@/components/button';
import { X, Plus } from 'lucide-react';
import Link from 'next/link';
import useStore from '@/stores';
import OrderItemsAndCategory from './order-item-and-category';
import OrderCartItem from './order-cart-item';
import OrderItemConfirm from './order-item-confirm';
import SearchEmployer from './SearchEmployer';
import { USER_TYPE } from '@/graphql/accounts';

interface ITEM_TYPE {
    quantity: number;
    price: number;
    id?: string;
    name?: string;
    itemId: string;
    vat: number;
}

const WasteAdd = () => {
    const [isModelOpen, setIsModalOpen] = useState(false);

    const selectedItems = useStore((store) => store.items);

    const selectedItemsArr: ITEM_TYPE[] = [];
    selectedItems.forEach((item, key) => {
        selectedItemsArr.push({ ...item, itemId: key });
    });

    const [selectedUser, setSelectedUser] = useState<USER_TYPE>();

   
    async function onSubmit() {
        setIsModalOpen(true);
    }

    const handleSelectUser = (newSelectedUser: USER_TYPE) => {
        setSelectedUser(newSelectedUser);
    };

    return (
        <div className="w-full h-[calc(100vh-100px)] flex gap-4">
            <OrderItemsAndCategory />
            {/* Updated Cart Section */}
            <Card
                className="w-[350px] 
                col-span-1
                h-[calc(100vh-105px)]
                flex flex-col "
            >
                {/* Header with Customer Selection */}
                <div className="p-4 border-b">
                    <div className="space-y-3">
                        {/* Customer Search */}
                        <SearchEmployer onSelect={handleSelectUser} />
                        {/* Customer Info */}
                        <div className="p-3 bg-muted rounded-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-medium">
                                        {`${
                                            selectedUser?.name ||
                                            'Responsible Epmployer'
                                        }`}{' '}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedUser?.email ||
                                            'No selected epmployer'}
                                    </p>
                                </div>
                                {!selectedUser ? (
                                    <Link href={`/users/add`}>
                                        <Button size="sm" variant="outline">
                                            <Plus />
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button
                                        onClick={() =>
                                            setSelectedUser(undefined)
                                        }
                                        size="icon"
                                        variant="destructive"
                                    >
                                        <X />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cart Items Section */}
                <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                        {/* Sample Cart Items */}
                        {selectedItemsArr?.map((item, i) => (
                            <OrderCartItem
                                id={item.itemId || ''}
                                key={`${item.itemId}-${i}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t ">
                    <div className="space-y-2">
                        
                        <div className=" mt-4  flex flex-col gap-2  ">
                            <div className="flex gap-2">
                                <Button
                                    disabled={selectedItems.size === 0}
                                    onClick={() => {
                                        onSubmit();
                                    }}
                                    className="w-full "
                                >
                                    Continue
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
            <OrderItemConfirm
                selectedUser={selectedUser}
                modalState={[isModelOpen, setIsModalOpen]}
            />
        </div>
    );
};

export default WasteAdd;
