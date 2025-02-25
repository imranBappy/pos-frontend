'use client';
import { useQuery, useMutation } from '@apollo/client';
import {
    ORDERS_QUERY,
} from '@/graphql/product/queries';
import { Form } from "@/components/ui/form"
import { PAYMENT_STATUSES, PAYMENT_STATUSES_LIST } from '@/constants/payment.constants';
import { toast } from '@/hooks/use-toast';
import * as z from "zod"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { randomId, toFixed } from '@/lib/utils';
import { Button } from '@/components/button';
import { SwitchItem, TextField } from '@/components/input';
import { PAYMENT_METHODS_TYPE } from '@/constants/payment.constants';
import Modal, { BUTTON_VARIANT_TYPE } from '@/components/modal';
import { useEffect, useState } from 'react';
import { SUPPLIER_PAYMENT_MUTATION } from '@/graphql/supplier-payment/mutations';
import { SUPPLIER_INVOICE_QUERY } from '@/graphql/supplier-invoice/queries';
import { SUPPLIER_PAYMENT_QUERY } from '@/graphql/supplier-payment/queries';
import Info from '@/components/Info';

const paymentFormSchema = z.object({
    amount: z.string(),
    status: z.string().min(3),
    paymentMethod: z.string().min(3),
    duePaymentDate: z.string().optional()
})
type paymentFormValues = z.infer<typeof paymentFormSchema>

interface PaymentProps {
    orderId?: string | undefined;
    disabled?: boolean,
    onPaymentRequest?: () => void;
    openBtnName: string
    variant?: BUTTON_VARIANT_TYPE,
    id?: string
    openBtnClassName?: string,
    modalState: [boolean, setIsModalOpen: (value: boolean) => void]
}

const SupplierPaymentModal = ({ modalState, openBtnClassName = 'w-full', id, variant = 'default', orderId, disabled = false, onPaymentRequest, openBtnName }: PaymentProps) => {
    const [isModelOpen, setIsModalOpen] = modalState
    const [_orderId, setOrderId] = useState<string | undefined>(undefined)

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
            status: PAYMENT_STATUSES.COMPLETED,
            paymentMethod: "CASH",

        }
    })

    const { data: orderRes, loading } = useQuery(SUPPLIER_INVOICE_QUERY, {
        variables: { id: Number(_orderId) },
        onCompleted: (res) => {
            paymentForm.setValue('amount', `${parseInt(res?.supplierInvoice?.amount) ? toFixed(res?.supplierInvoice?.due) : toFixed(res?.supplierInvoice?.finalAmount)}`)
        },
        skip: !_orderId
    });

    const [paymentMutation, { loading: paymentLoading }] = useMutation(SUPPLIER_PAYMENT_MUTATION,
        {
            onCompleted: async () => {
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
        }
    )


    const { data: paymentRes, loading: paymentQueryLoading } = useQuery(SUPPLIER_PAYMENT_QUERY, {
        variables: {
            id: id
        },
        onCompleted: ({ payment }) => {
            paymentForm.setValue('status', payment?.status)
            paymentForm.setValue('paymentMethod', payment?.payment_method)
        },
        skip: !id
    })
    const order = orderRes?.supplierInvoice;
    const payment = paymentRes?.data?.supplierPayment
    const currentDue = Number(toFixed(order?.due || 0)) - Number(paymentForm.watch('amount'))

    const handlePayment = async (data: paymentFormValues) => {
        try {
            if (!_orderId && !id) {
                toast({
                    title: 'Order Id or Payment id not found!',
                    variant: 'destructive'
                })
                return;
            }
            if (Number(toFixed(data.amount)) < 1) {
                toast({
                    title: 'Amount Error',
                    description: 'Minmum amount 1',
                    variant: 'destructive'
                })
                return;
            }

            if (toFixed(data.amount) > toFixed(order.amount)) {
                toast({
                    title: 'Amount Error',
                    description: 'Amount can not be greater than order amount',
                    variant: 'destructive'
                })
                return;
            }
            if (currentDue && !data.duePaymentDate) {
                toast({
                    description: 'Input next payment date',
                    variant: 'destructive'
                })
                return;
            }
            await paymentMutation({
                variables: {
                    id: id,
                    amount: toFixed(data.amount),
                    paymentMethod: data.paymentMethod,
                    status: PAYMENT_STATUSES.COMPLETED,
                    invoice: _orderId,
                    trxId: payment?.trxId ? payment?.trxId : randomId(),
                    duePaymentDate: data.duePaymentDate
                }
            })



        } catch (error: unknown) {
            toast({
                title: 'Payment',
                description: (error as Error).message,
                variant: 'destructive',
            })
        }
    }
    const isLoading = paymentQueryLoading || paymentLoading || loading
    // if (loading) return <Loading />;
    
    return (
        <Modal
            openBtnClassName={openBtnClassName}
            openBtnName={openBtnName}
            title="Payment"
            className="max-w-xl"
            disabled={isLoading || disabled}
            variant={variant}
            isCloseBtn={false}
            open={isModelOpen && !disabled}
            onOpenChange={(value) => {
                console.log(value);
                setIsModalOpen(value);
                // return value ? null : setIsModalOpen(value);
            }}
            onOpen={onPaymentRequest}
        >
            <Form {...paymentForm}>
                <form
                    onSubmit={paymentForm.handleSubmit(handlePayment)}
                    className="w-full space-y-6 p-4"
                >
                    {/* Order Information */}
                    <div className="grid grid-cols-2 md:grid-cols-2  gap-4 ">
                        <TextField
                            form={paymentForm}
                            name="amount"
                            label="Amount"
                            // type='number'
                            placeholder="Enter amount"
                            className="w-full h-11"
                            itemClassName="w-full"
                            rest={{
                                max: parseInt(orderRes?.supplierInvoice?.due)
                                    ? toFixed(orderRes?.supplierInvoice?.due)
                                    : toFixed(
                                          orderRes?.supplierInvoice?.amount
                                      ),
                            }}
                        />
                        <SwitchItem
                            form={paymentForm}
                            name="status"
                            label="Status"
                            options={PAYMENT_STATUSES_LIST.map((status) => ({
                                label: status,
                                value: status,
                            }))}
                            placeholder="Select Status"
                        />
                        <SwitchItem
                            form={paymentForm}
                            name="paymentMethod"
                            label="Payment Method"
                            options={PAYMENT_METHODS_TYPE.map((item) => ({
                                label: item,
                                value: item,
                            }))}
                            placeholder="Select payment "
                        />
                        <TextField
                            disabled={!currentDue}
                            form={paymentForm}
                            name="duePaymentDate"
                            label="Due Payment Date"
                            placeholder="Due payment date"
                            type="date"
                        />
                    </div>
                    {currentDue ? (
                        <Info
                            message={`Now your due amount is ${currentDue}.`}
                        />
                    ) : null}

                    <div className=" flex gap-2 ">
                        <Button
                            className="w-28"
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            variant="outline"
                        >
                            {'Close'}
                        </Button>
                        <Button isLoading={isLoading}>
                            {id ? 'Payment Update' : 'Payment'}
                        </Button>
                    </div>
                </form>
            </Form>
        </Modal>
    );
};

export default SupplierPaymentModal;