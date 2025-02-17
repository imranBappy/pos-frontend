import Modal from '@/components/modal';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { calculateDiscount } from './pos';
import { useEffect, useState } from 'react';
import { toFixed } from '@/lib/utils';
import useStore from '@/stores';
import { CARD_TYPE } from '@/stores/slices';


const DiscountModel = () => {

    const cart = useStore((store) => store.cart)
    const addCarts = useStore((store) => store.addCarts)
    const [discountCart, setDiscountCart] = useState<CARD_TYPE[]>(cart);

    const handleDiscount = (id: string, discount: number) => {
        //  negative discount can't be allowed
        if (discount < 0) return;

        // discount can't be greater than price
        const item: (CARD_TYPE | undefined) = discountCart.find((item: CARD_TYPE) => item.id === id);
        if (!item) return;
        if (discount > item.price) return;

        setDiscountCart(prev => prev.map(item => item.id === id ? {
            ...item,
            totalDiscount: discount,
            discount: item.price - calculateDiscount(item.price, item.vat, discount)
        } : item));
    }

    const handleConfirm = () => {
        addCarts(discountCart);
    }

    useEffect(() => {
        setDiscountCart(cart);
    }, [cart]);

    return (
        <div className=' flex flex-col items-end'>
            <Modal
                onClose={handleConfirm}
                openBtnClassName='w-[155px]'
                openBtnName='Discount'
                title='Discount '
                className='max-w-2xl'
                disabled={!cart?.length}
                isCloseBtn={true}
                closeBtnName='Continue'
            >

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-[13px] font-medium uppercase tracking-wider">Name</TableHead>
                            <TableHead className="text-[13px] font-medium uppercase tracking-wider">Quantity</TableHead>
                            <TableHead className="text-[13px] font-medium uppercase tracking-wider">Price</TableHead>
                            <TableHead className="text-[13px] font-medium uppercase tracking-wider">Discount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {discountCart?.map((node) => (
                            <TableRow key={node.id}>
                                <TableCell className="py-4">{node?.name}</TableCell>
                                <TableCell className="py-4">{node?.quantity}</TableCell>
                                <TableCell className="py-4">${node?.price?.toFixed(2)}</TableCell>
                                <TableCell className="py-4 font-medium">
                                    <Input
                                        onChange={(e) => handleDiscount(node.id, parseFloat(e.target.value) || 0)}
                                        value={toFixed(node.totalDiscount) || ""}
                                        placeholder='Discount amount'
                                        step={0.01}
                                        min={0.00}
                                        type='number'
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            </Modal>
        </div>
    );
};

export default DiscountModel;