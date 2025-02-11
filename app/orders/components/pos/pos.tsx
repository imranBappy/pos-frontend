"use client"
import React, { useContext, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import * as z from "zod"
import { ORDER_PRODUCT_MUTATION, ORDER_MUTATION, PRODUCT_TYPE, ORDERS_QUERY, ORDER_QUERY, DELETE_ORDER_PRODUCT, FLOOR_TABLES_TYPE, } from '@/graphql/product';
import { USER_QUERY } from '@/graphql/accounts/queries';
import { cn, findVat, toFixed } from '@/lib/utils';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import CardItem from './card-item';
import { toast } from '@/hooks/use-toast';
import { FilterState } from '@/app/product/components';
import Button from '@/components/button';
import { SidebarContext } from '@/components/ui/sidebar';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { X, LampFloor, Plus, Search } from 'lucide-react';
import PaymentModal from '../order-payment/payment-modal';
import { useSearchParams } from 'next/navigation';
import DiscountModel from './DiscountModel';
import POSCategories from './POS-categories';
import POSProducts from './POS-products';
import Link from 'next/link';
import useStore from '@/stores';
import { CARD_TYPE } from '@/stores/slices/cartSlice';


export const calculateDiscount = (price: number, vat: number, discount: number) => {
    const total = findVat(price, vat) + price;
    const discountPrice = ((total - discount) / (100 + vat)) * 100;
    return discountPrice;
}

const calculateVat = (cart: CARD_TYPE[]) => {
    const result = cart?.reduce((total, item) => {
        if (item.discount > 0) {
            const discountedPrice = calculateDiscount(item.price, item.vat, item.totalDiscount)
            return total + findVat(discountedPrice, item.vat) * item.quantity
        }
        return total + findVat(item.price, item.vat) * item.quantity
    }, 0)
    return result
};

const calculatePrice = (cart: CARD_TYPE[]) => {
    const result = cart?.reduce((total, item) => {
        if (item.discount > 0) {
            return total + calculateDiscount(item.price, item.vat, item.totalDiscount) * item.quantity
        }
        return total + (item.price * item.quantity)
    }, 0)
    return result
}

const Pos = () => {
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        category: null,
        subcategory: null,
        kitchen: null,
        tag: '',
        price: 0,
        priceLte: null,
        orderByPrice: '',
        isActive: 'ALL',
        orderBy: '',
    })
    const searchParams = useSearchParams()
    const id = searchParams.get('id')
    const [orderId, setOrderId] = useState<string | undefined>()
    const debouncedSearch = useDebouncedValue(filters.search, 500);
    const tableState = useStore((store) => store.table)
    const clearTable = useStore((store) => store.clearTable)
    const outlets = useStore((store) => store.outlets)
    const activeOutlet = outlets[0];

    const cart = useStore((store) => store.cart)
    const addCart = useStore((store) => store.addCart)
    const clearCart = useStore((store) => store.clearCart)
    const addCarts = useStore((store) => store.addCarts)
    const decrementItemQuantity = useStore((store) => store.decrementItemQuantity)
    const incrementItemQuantity = useStore((store) => store.incrementItemQuantity)

    const sidebarContext = useContext(SidebarContext)
    const [userSearchValue, setUserSearchValue] = useState<{
        email: undefined | string,
        phone: undefined | string
    }>({
        email: undefined,
        phone: undefined
    })
    const [createOrder, { loading: createOrderLoading }] = useMutation(ORDER_MUTATION, {
        onCompleted: ({ orderCud }) => {
            setOrderId(orderCud?.order?.id)
        },
        refetchQueries: [{
            query: ORDERS_QUERY, variables: {
                first: 10,
                offset: 0
            }
        }],
        awaitRefetchQueries: true
    })
    const [deleteOrderProduct] = useMutation(DELETE_ORDER_PRODUCT)
    const [createOrderProduct, { loading: createOrderProductLoading }] = useMutation(ORDER_PRODUCT_MUTATION)
    const emailSchema = z.string().email({ message: "Invalid email format" });


    const { data: userData } = useQuery(USER_QUERY, {
        variables: {
            email: userSearchValue.email,
            phone: (!userSearchValue.email && userSearchValue.phone) ? userSearchValue.phone : undefined
        },
        onError: (error) => {
            console.log(error);
        },
        skip: !(userSearchValue.email || userSearchValue.phone)
    }
    );
    const { data: orderRes } = useQuery(ORDER_QUERY, {
        variables: {
            id: id
        },
        skip: !id,
        onCompleted: ({ order }) => {
            const items = order?.items?.edges?.map(({ node }: { node: CARD_TYPE }) => ({
                id: node?.product?.id,
                name: node?.product?.name,
                vat: node?.product?.vat,
                discount: parseFloat(`${node.discount}`),
                price: parseFloat(`${node.price}`),
                quantity: node.quantity,
                itemId: node.id,
                totalDiscount: node.discount ? parseFloat(`${toFixed(node.discount)}`) + findVat(parseFloat(`${node.discount}`), node?.product?.vat || 1) : 0,
            }))
            console.log({ items });

            addCarts(items)
        }
    })

    const handleFilterChange = (key: keyof FilterState) => (value: FilterState[typeof key]) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
        }))
    }
    const handleAddToCart = (product: PRODUCT_TYPE) => {
        if (!product.id) return;
        const existingItem = cart?.find(item => item.id === product.id);
        if (existingItem) {
            incrementItemQuantity(existingItem.id);
            return;
        }
        const newCartItem = {
            id: product.id as string,
            name: product.name,
            price: product.price,
            quantity: 1,
            vat: product.vat,
            discount: 0,
            totalDiscount: 0
        }
        addCart(newCartItem);
    }


    const finalAmount = (calculatePrice(cart) + calculateVat(cart)).toFixed(2);
    const subTotal = calculatePrice(cart)?.toFixed(2);


    const handlePlaceOrder = async () => {
        try {
            setOrderId(undefined)
            if (!cart.length) {
                toast({
                    title: "Error",
                    description: "Cart is empty!",
                    variant: "destructive",
                })
                return;
            }
            const finalAmount = (calculatePrice(cart) + calculateVat(cart)).toFixed(2);
            const amount = calculatePrice(cart).toFixed(2)

            const tableBookings = tableState.map((item: FLOOR_TABLES_TYPE) => [item.id, 60])
            if (Number(amount) < 0) {
                toast({
                    title: "Error",
                    description: "Negative can't be total amount! ",
                    variant: "destructive",
                })
                return;
            }

            const order = await createOrder({
                variables: {
                    id: id ? id : undefined,
                    orderId: searchParams.get('orderId') ? `#${searchParams.get('orderId')}` : undefined,
                    status: "PENDING",
                    paymentMethod: 'CASH',
                    finalAmount: finalAmount,
                    type: 'DINE_IN',
                    outlet: activeOutlet.id,
                    user: userData?.user?.id,
                    tableBookings: tableBookings.length ? JSON.stringify(tableBookings) : null,
                    isCart: true,
                    amount: amount
                },
            });
            if (!order.data.orderCud.order.id) {
                toast({
                    title: "Error",
                    description: 'There is an error!',
                    variant: "destructive",
                })
                return;
            }
            await Promise.all(cart.map(item => createOrderProduct({
                variables: {
                    id: item?.itemId ? item?.itemId : undefined,
                    price: parseFloat(`${item.price}`).toFixed(2),
                    product: item.id,
                    quantity: item.quantity,
                    discount: item.discount.toFixed(2),
                    order: order.data.orderCud.order.id,
                    vat: item.vat,
                },
            })))

            // delete product
            if (id) {
                const orderItemsDelete: string[] = []
                orderRes.order?.items?.edges.forEach(({ node }: { node: CARD_TYPE }) => {
                    if (!cart.find(((item) => item?.itemId?.toString() === node?.id.toString()))) {
                        orderItemsDelete.push(node?.id)
                    }
                    if (cart.find(((item) => item?.itemId?.toString() === node?.id.toString()))?.quantity === 0) {
                        orderItemsDelete.push(node?.id)
                    }
                });

                await Promise.all(orderItemsDelete.map((itemId) => deleteOrderProduct({
                    variables: {
                        id: itemId,
                    },
                })))
            }


            // toast({
            //     title: "Order Created",
            //     description: "Order has been created successfully",
            // })

            clearCart()
            setUserSearchValue({
                email: undefined,
                phone: undefined
            })

            // setFloorTable({
            //     floor: "",
            //     table: ""
            // })
            clearTable()

        } catch (error) {
            toast({
                title: "Error",
                description: (error as Error).message,
                variant: "destructive",
            })
        }
    }

    const handleUserSearch = (value: string) => {
        if (value === '') setUserSearchValue({
            email: undefined,
            phone: undefined
        });
        try {
            emailSchema.parse(value)
            setUserSearchValue({ email: value, phone: undefined })
        } catch (error) {
            if (value.length > 10 && value.length < 16) {
                setUserSearchValue({ email: undefined, phone: value })
            }
            console.error("Unexpected Error:", error);
        }

    };

    useEffect(() => {
        handleFilterChange("search")(debouncedSearch);
    }, [debouncedSearch]);


    return (
        <div className="w-full h-[calc(100vh-100px)] flex gap-4">
            <div className={cn("h-full", sidebarContext?.open ? "w-[calc(100vw-654px)]" : "w-[calc(100vw-447px)]")}>
                <Card className=" p-3">
                    <div className="relative mb-4">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={filters.search}
                            onChange={(e) => setFilters((preState) => ({ ...preState, search: e.target.value }))}
                            placeholder="Search products..."
                            className="pl-8"
                        />
                    </div>
                    {/* Categories Section */}
                    <POSCategories
                        filters={filters}
                        handleFilterChange={handleFilterChange}
                    />
                    <POSProducts
                        filters={filters}
                        handleAddToCart={handleAddToCart}
                        cart={cart}
                    />
                </Card>
            </div>
            {/* Updated Cart Section */}
            <Card className="w-[350px] 
                col-span-1
                h-[calc(100vh-105px)]
                flex flex-col
            ">
                {/* Header with Customer Selection */}
                <div className="p-4 border-b">
                    <div className="space-y-3">
                        {/* Customer Search */}
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search customer..."
                                className="pl-8"
                                onChange={(e) => handleUserSearch(e.target.value)}
                            />
                        </div>

                        {/* Customer Info */}
                        <div className="p-3 bg-muted rounded-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-medium">{`${userData?.user?.name || 'Walk-in Customer'}`} </p>
                                    <p className="text-sm text-muted-foreground">{userData?.user?.email || 'No email address'}</p>
                                </div>
                                {
                                    !userData?.user && <Link href={`/users/add`}>
                                        <Button size='sm' variant='outline' >
                                            <Plus />
                                        </Button>
                                    </Link>
                                }

                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4 border-b ">
                    {/* Table */}
                    <div className='flex gap-2'>
                        <div className="flex justify-between w-full ">
                            <h5 className='flex items-center gap-2  '> <span>Table :</span> <span className='flex items-center'><LampFloor className=" h-4 w-4 text-muted-foreground" /> {
                                tableState?.length
                            }</span></h5>
                            <div className=' flex gap-1'>
                                <Button onClick={clearTable} className='rounded-sm' size='sm' variant='destructive'>
                                    <X />
                                </Button>
                                <Link href={`/floor/tables-view`}>
                                    <Button className=' rounded-sm' size='sm' variant='secondary' >
                                        <Plus />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cart Items Section */}
                <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                        {/* Sample Cart Items */}
                        {
                            cart?.map((item) => <CardItem
                                onMinusItem={() => decrementItemQuantity(item.id)}
                                discount={item.discount}
                                key={item.id}
                                name={item.name}
                                price={item.price}
                                quantity={item.quantity}
                                onPlusItem={() => incrementItemQuantity(item.id)}
                            />)
                        }
                    </div>
                </div>

                <div className="p-4 border-t ">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>$ {subTotal || '0'} </span>
                        </div>
                        <div className="flex justify-between">
                            <span>VAT</span>
                            <span>${(calculateVat(cart)?.toFixed(2)) || '0'}</span>
                        </div>
                        <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span>$ {finalAmount || '0'}</span>
                        </div>
                        <div className=' mt-4  flex flex-col gap-2  '>
                            <DiscountModel />
                            <div className='flex gap-2'>
                                <PaymentModal
                                    variant="outline"
                                    openBtnName="Order"
                                    orderId={orderId}
                                    disabled={
                                        (createOrderLoading || createOrderProductLoading)
                                    }
                                    onPaymentRequest={handlePlaceOrder}
                                />
                                <Button disabled={cart?.length === 0} isLoading={createOrderLoading || createOrderProductLoading} onClick={() => { handlePlaceOrder() }} className="w-full ">
                                    Add To Cart
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Pos;