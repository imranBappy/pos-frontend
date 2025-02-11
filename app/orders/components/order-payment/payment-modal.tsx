'use client';
import { useQuery, useMutation } from '@apollo/client';
import {
    ORDER_QUERY,
    ORDERS_QUERY,
    PAYMENT_QUERY,
    PAYMENTS_QUERY
} from '@/graphql/product/queries';
import {
    Form,
} from "@/components/ui/form"
import {
    ORDER_TYPE_UPDATE,
    PAYMENT_MUTATION
} from '@/graphql/product';
import { PAYMENT_STATUSES, PAYMENT_STATUSES_LIST } from '@/constants/payment.constants';

import { toast } from '@/hooks/use-toast';
import * as z from "zod"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { randomId, toFixed, underscoreToSpace } from '@/lib/utils';
import { Button } from '@/components/button';
import { SwitchItem, TextField } from '@/components/input';
import { PAYMENT_METHODS_TYPE } from '@/constants/payment.constants';
import Modal, { BUTTON_VARIANT_TYPE } from '@/components/modal';
import { useEffect, useState } from 'react';
import { ORDER_TYPE_LIST, ORDER_TYPES } from '@/constants/order.constants';
import Address from './address';
import { ADDRESS_DEFAULT_UPDATE, ADDRESS_TYPE } from '@/graphql/accounts';

const ORDER_TYPE = [...ORDER_TYPE_LIST]


const paymentFormSchema = z.object({
    order: z.string(),
    amount: z.string(),
    trx_id: z.string().min(10),
    status: z.string().min(3),
    payment_method: z.string().min(3),
    remarks: z.string().optional(),
    type: z.string()
})


type paymentFormValues = z.infer<typeof paymentFormSchema>

interface PaymentProps {
    orderId?: string | undefined;
    disabled?: boolean,
    onPaymentRequest?: () => void;
    openBtnName: string
    variant?: BUTTON_VARIANT_TYPE,
    id?: string
    openBtnClassName?: string
}

const PaymentModal = ({ openBtnClassName = 'w-full', id, variant = 'default', orderId, disabled = false, onPaymentRequest, openBtnName }: PaymentProps) => {
    const [isModelOpen, setIsModalOpen] = useState(false)
    const [_orderId, setOrderId] = useState<string | undefined>(undefined)

    const [addressUpdate, { loading: create_loading }] = useMutation(ADDRESS_DEFAULT_UPDATE, {
        refetchQueries: [{
            query: ORDER_QUERY, variables: { id: Number(_orderId) }
        },
        ],
        awaitRefetchQueries: true
    })
    const [defaultAddress, setDefaultAddress] = useState<ADDRESS_TYPE | undefined>()

    useEffect(() => {
        if (isModelOpen) {
            setOrderId(orderId)
        } else {
            setOrderId(undefined)
        }
        return () => {
            setOrderId(undefined)
        }
    }, [orderId, isModelOpen])

    const paymentForm = useForm<paymentFormValues>({
        resolver: zodResolver(paymentFormSchema),
        defaultValues: {
            trx_id: `${randomId()}`,
            status: PAYMENT_STATUSES.COMPLETED,
            payment_method: "CASH",
            order: String(_orderId)
        }
    })
    const { data: orderRes, loading } = useQuery(ORDER_QUERY, {
        variables: { id: Number(_orderId) },
        onCompleted: (res) => {
            const findDefault = res?.order?.user?.address?.edges?.find((item: { node: ADDRESS_TYPE }) => item.node?.default)
            if (findDefault) {
                setDefaultAddress(findDefault?.node)
            }

            paymentForm.setValue('order', res?.order?.id)
            paymentForm.setValue('amount', `${parseInt(res?.order?.due) ? toFixed(res?.order?.due) : toFixed(res?.order?.finalAmount)}`)
            paymentForm.setValue('trx_id', `${randomId()}`)
            paymentForm.setValue('type', res?.order?.type)

        },
        skip: !_orderId
    });
    const [orderTypeUpdate] = useMutation(ORDER_TYPE_UPDATE, {
        onError: (e) => {
            toast({
                title: "Payment Error",
                description: e.message,
                variant: 'destructive'
            })
        },
        refetchQueries:
            [
                { query: ORDER_QUERY, variables: { id: _orderId } },
                { query: ORDERS_QUERY },
                {
                    query: PAYMENTS_QUERY, variables: {
                        first: 10,
                        offset: 0,
                        search: ""
                    }
                }
            ],

    });
    const [createPayment, { loading: paymentLoading }] = useMutation(PAYMENT_MUTATION, {
        onCompleted: async (res) => {
            const order = res?.paymentCud?.payment?.order;
            const newOrder = {
                id: order.id,
                orderType: paymentForm.getValues('type'),
            }
            if (newOrder.id) {
                orderTypeUpdate({
                    variables: newOrder,
                });
            }
            setIsModalOpen(false)
            setOrderId(undefined)


            paymentForm.reset()
        },
        onError: (e) => {
            toast({
                title: "Payment Error",
                description: e.message,
                variant: 'destructive'
            })
        },
        refetchQueries: [{
            query: ORDERS_QUERY, variables: {
                first: 10,
                offset: 0
            }
        }],
        awaitRefetchQueries: true

    })


    useQuery(PAYMENT_QUERY, {
        variables: {
            id: id
        },
        onCompleted: ({ payment }) => {
            paymentForm.setValue('order', payment?.order.id)
            paymentForm.setValue('amount', payment?.amount)
            paymentForm.setValue('trx_id', payment?.trxId)
            paymentForm.setValue('status', payment?.status)
            paymentForm.setValue('remarks', payment?.remarks)
            paymentForm.setValue('payment_method', payment?.payment_method)
        },
        skip: !id
    })
    const order = orderRes?.order;

    const handlePayment = async (data: paymentFormValues) => {
        try {
            if (!_orderId && !id) {
                toast({
                    title: 'Order Id or Payment id not found!',
                    variant: 'destructive'
                })
                return;
            }
            if (Number(parseFloat(`${data.amount}`).toFixed(2)) < 1) {
                toast({
                    title: 'Amount Error',
                    description: 'Minmum amount 1',
                    variant: 'destructive'
                })
                return;
            }

            if (parseFloat(parseFloat(`${data.amount}`).toFixed(2)) > parseFloat(order.finalAmount)) {
                toast({
                    title: 'Amount Error',
                    description: 'Amount can not be greater than order amount',
                    variant: 'destructive'
                })
                return;
            }
            if (data.type === ORDER_TYPES.DELIVERY && !defaultAddress?.id) {
                toast({
                    title: 'Address Error',
                    description: 'Please select the address',
                    variant: 'destructive'
                })
                return;
            }



            await createPayment({
                variables: {
                    id: id,
                    amount: parseFloat(`${data.amount}`).toFixed(2),
                    order: data.order,
                    paymentMethod: data.payment_method,
                    status: data.status,
                    trxId: data.trx_id,
                    remarks: data.remarks,
                }
            })

            if (defaultAddress && order?.user?.id && data.type === ORDER_TYPES.DELIVERY) {
                await addressUpdate({
                    variables: { ...defaultAddress, user: order?.user?.id }
                })
            }




            // toast({
            //     title: 'Payment',
            //     description: 'Payment successfully.',
            // })
        } catch (error: unknown) {
            toast({
                title: 'Payment',
                description: (error as Error).message,
                variant: 'destructive',
            })
        }
    }

    const address1 = orderRes?.order?.user?.address?.edges[0]?.node
    const address2 = orderRes?.order?.user?.address?.edges[1]?.node

    const handleSelectAddress = (add: ADDRESS_TYPE) => {
        if (add) {
            setDefaultAddress({ ...add, user: orderRes?.order?.user?.id, default: true })
        }

    }

    // if (loading) return <Loading />;

    return (
        <Modal
            openBtnClassName={openBtnClassName}
            openBtnName={openBtnName}
            title='Payment'
            className='max-w-xl'
            disabled={paymentLoading || disabled || loading}
            variant={variant}
            isCloseBtn={false}
            open={(isModelOpen && !disabled)}
            onOpenChange={setIsModalOpen}
            onOpen={onPaymentRequest}
        >
            <Form  {...paymentForm}>
                <form onSubmit={paymentForm.handleSubmit(handlePayment)} className="space-y-6 p-4">
                    {/* Order Information */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 ">
                        <div className="">
                            <TextField
                                form={paymentForm}
                                name="amount"
                                label="Amount"
                                // type='number'
                                placeholder="Enter amount"
                                className="w-full h-11"
                                itemClassName='w-full'
                                rest={{
                                    max: parseInt(orderRes?.order?.due) ? toFixed(orderRes?.order?.due) : toFixed(orderRes?.order?.finalAmount)
                                }}
                            />
                        </div>
                        <div className="">
                            <SwitchItem
                                form={paymentForm}
                                name="status"
                                label="Status"
                                options={PAYMENT_STATUSES_LIST.map((status) => ({ label: status, value: status }))}
                                placeholder="Select Status"
                            />
                        </div>
                        <div className="">
                            <SwitchItem
                                form={paymentForm}
                                name="payment_method"
                                label="Payment Method"
                                options={PAYMENT_METHODS_TYPE.map((item) => ({ label: item, value: item, }))}
                                placeholder="Select payment "
                            />
                        </div>

                        <div className="  ">
                            <SwitchItem
                                form={paymentForm}
                                name="type"
                                label="Order Type"
                                options={ORDER_TYPE.map((item) => ({
                                    label: underscoreToSpace(item),
                                    value: item,
                                    disabled: !orderRes?.order.user && item === ORDER_TYPES.DELIVERY
                                }))}
                                placeholder="Select order type "
                            />
                        </div>
                        <div className=" col-span-2">
                            <TextField
                                form={paymentForm}
                                name="remarks"
                                label="Remark"
                                placeholder="Remark"
                                className="w-full h-11"
                                itemClassName='w-full'
                            />
                        </div>
                    </div>
                    {
                        paymentForm.watch('type') === ORDER_TYPES.DELIVERY ?
                            !address1 && !address2 ? <div className=' flex gap-3 mb-5'>
                                <Address
                                    onSelect={() => handleSelectAddress(address1)}
                                    user={orderRes?.order?.user}
                                    address={{
                                        ...address1,
                                        addressType: "HOME",
                                        default: address1?.id && address1?.id === defaultAddress?.id
                                    }}
                                />
                                <Address
                                    onSelect={() => handleSelectAddress(address2)}
                                    address={{
                                        ...address2,
                                        addressType: "OFFICE",
                                        default: address2?.id && address2?.id === defaultAddress?.id
                                    }}
                                    user={orderRes?.order?.user}
                                />
                            </div> :
                                <div className=' flex gap-3 mb-5'>
                                    <Address
                                        onSelect={() => handleSelectAddress(address1)}
                                        user={orderRes?.order?.user}
                                        address={{
                                            ...address1,
                                            default: address1?.id && address1?.id === defaultAddress?.id
                                        }}
                                    />
                                    <Address
                                        onSelect={() => handleSelectAddress(address2)}
                                        address={{
                                            ...address2,
                                            default: address2?.id && address2?.id === defaultAddress?.id
                                        }}
                                        user={orderRes?.order?.user}
                                    />
                                </div> : ""
                    }

                    <Button isLoading={paymentLoading || loading || create_loading}>
                        {
                            id ? "Payment Update" : "Payment"
                        }
                    </Button>
                </form>
            </Form>
        </Modal>
    );
};

export default PaymentModal;