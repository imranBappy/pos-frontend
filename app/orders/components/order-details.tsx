'use client';
import { useQuery, useMutation } from '@apollo/client';
import { ADDRESS_QUERY, ORDER_QUERY } from '@/graphql/product/queries';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Image from '@/components/ui/image';
import { ORDER_MUTATION, PAYMENT_TYPE } from '@/graphql/product';
import { ORDER_STATUSES } from '@/constants/order.constants';
import { Loading } from '@/components/ui';
import { toast } from '@/hooks/use-toast';
import { findVat, getStatusStyle, getThumblain, toFixed } from '@/lib/utils';
import moment from 'moment';
import { ADDRESS_TYPE } from '@/graphql/accounts';
import InvoiceGenerate from '@/components/invoice-generate';
import PaymentModal from './order-payment/payment-modal';
import Link from 'next/link';
import Button from '@/components/button';


interface ProductNode {
    node: {
        id: string;
        product: {
            name: string;
            images: string;
            price: number;
        };
        quantity: number;
        price: number;
        discount: number;
        vat: number;
    };
}
export const OrderDetails = ({ orderId }: { orderId: string }) => {
    const { data, loading, error } = useQuery(ORDER_QUERY, {
        variables: { id: Number(orderId) },
    });
    const { data: addressRes } = useQuery(ADDRESS_QUERY, {
        variables: { user: data?.order?.user?.id },
        skip: !data?.order?.user?.id,
    });


    const [updateStatus] = useMutation(ORDER_MUTATION, {
        refetchQueries: [{ query: ORDER_QUERY, variables: { id: orderId } }],
    });

    const handleStatusChange = async (newStatus: string) => {
        try {
            await updateStatus({
                variables: {
                    id: orderId,
                    status: newStatus,
                    paymentMethod: order?.paymentMethod,
                    finalAmount: order?.finalAmount,
                    amount: order?.finalAmount,
                    due: order?.due,
                    type: order?.type,
                    user: order?.user?.id,
                    outlet: order?.outlet?.id,
                },
            });
            toast({
                title: 'Order Status Updated',
                description: 'The order status has been updated successfully.',
            })
        } catch (error) {
            toast({
                title: 'Failed to update status',
                description: error instanceof Error ? error.message : 'An unknown error occurred',
                variant: 'destructive',
            })
        }
    };

    if (loading) return <Loading />;
    if (error) return <div>Error: {error.message}</div>;

    const order = data.order;
    // const address = addressRes?.address;
    const payments = order?.payments;

    type addressType = {
        node: ADDRESS_TYPE
    }
    const address = order?.user?.address?.edges.find((item: addressType) => item.node.default)?.node

    const discount = (discount: number, vat: number) => {
        return parseFloat(`${discount}`) + findVat(discount, vat)
    }

    return (
        <div className="space-y-6 p-4">
            {
                (order.status === ORDER_STATUSES.COMPLETED) ? <>
                    <InvoiceGenerate order={order} />
                </> : ""
            }
            {
                (order.status === ORDER_STATUSES.DUE) ? <div className=' justify-end flex gap-2'>

                    <InvoiceGenerate order={order} />
                    <PaymentModal
                        openBtnClassName="w-[102px] "
                        openBtnName="Payment"
                        orderId={order.id}
                    />
                </div> : ""
            }
            {
                order.status === ORDER_STATUSES.PENDING ? <div className=' justify-end flex gap-2'>
                    <Link href={`/orders/pos?id=${order.id}`}>
                        <Button variant='outline'>Edit</Button>
                    </Link>
                    <PaymentModal
                        openBtnClassName="w-[102px] "
                        openBtnName="Payment"
                        orderId={order.id}
                    />
                </div> : ""
            }

            {/* Customer Information */}
            <Card className="shadow-sm">
                <CardHeader className="border-b">
                    <CardTitle className="text-lg tracking-tight">Customer Details & Address</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className='flex justify-between'>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 border">
                                <AvatarImage src={order?.user?.photo || ''} />
                                <AvatarFallback>{order?.user?.name[0] || 'w'}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <p className="font-medium tracking-tight">{order?.user?.name || 'Walk-in Customer'}</p>
                                <p className="text-sm text-muted-foreground">{order?.user?.email || 'No email address'}</p>
                            </div>
                        </div>
                        {
                            address ? <div className='flex gap-10'>
                                <div className="space-y-2">
                                    <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">City</p>
                                    <p>{address?.city}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">Area</p>
                                    <p className="font-medium">${address?.area}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">Street</p>
                                    <p>{address?.street}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">House No</p>
                                    <p>{address?.house}</p>
                                </div>
                            </div> : ""
                        }

                    </div>
                </CardContent>
            </Card>

            {/* Order Information */}
            <Card className="shadow-sm">
                <CardHeader className="border-b">
                    <CardTitle className="text-lg tracking-tight">Order Information</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">Order ID</p>
                            <p className="font-medium">{order?.orderId}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">Status</p>
                            <Select
                                defaultValue={order.status}
                                value={order.status}
                                onValueChange={handleStatusChange}
                                disabled={order.status === ORDER_STATUSES.COMPLETED}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem disabled value={ORDER_STATUSES.COMPLETED}>
                                        <Badge className={`${getStatusStyle(ORDER_STATUSES.COMPLETED)} border-0`}>
                                            {ORDER_STATUSES.COMPLETED}
                                        </Badge>
                                    </SelectItem>
                                    <SelectItem disabled value={ORDER_STATUSES.DUE}>
                                        <Badge className={`${getStatusStyle(ORDER_STATUSES.DUE)} border-0`}>
                                            {ORDER_STATUSES.DUE}
                                        </Badge>
                                    </SelectItem>
                                    <SelectItem value={ORDER_STATUSES.PENDING}>
                                        <Badge className={`${getStatusStyle(ORDER_STATUSES.PENDING)} border-0`}>
                                            {ORDER_STATUSES.PENDING}
                                        </Badge>
                                    </SelectItem>
                                    <SelectItem value={ORDER_STATUSES.CANCELLED}>
                                        <Badge className={`${getStatusStyle(ORDER_STATUSES.CANCELLED)} border-0`}>
                                            {ORDER_STATUSES.CANCELLED}
                                        </Badge>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">Type</p>
                            <p>{order?.type?.split("_").join(" ")}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">Total Amount</p>
                            <p className="font-medium">${toFixed(order?.finalAmount)}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">Due Amount</p>
                            <p className="font-medium">${toFixed(order?.due)}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">Create At</p>
                            <p>{moment(order?.createAt).fromNow()}</p>
                        </div>
                    </div>
                    {
                        addressRes?.address && (<>
                            <Separator className="my-8" />
                            <div className="space-y-4">
                                <h3 className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">Delivery Address</h3>
                                <div className="space-y-1">
                                    <p className="text-sm">{addressRes?.address?.street}</p>
                                    <p className="text-sm">{addressRes?.address?.city}, {addressRes?.address?.state} {addressRes?.address?.zipCode}</p>
                                </div>
                            </div>
                        </>)
                    }

                </CardContent>
            </Card>
            {/* Payment */}

            {
                payments?.edges?.length ? <Card className="shadow-sm">
                    <CardHeader className="border-b">
                        <CardTitle className="text-lg tracking-tight">Payment</CardTitle>
                    </CardHeader>

                    {/* array of payment */}
                    <CardContent className="pt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-[13px] font-medium uppercase tracking-wider">Amount</TableHead>
                                    <TableHead className="text-[13px] font-medium uppercase tracking-wider">Payment Method</TableHead>
                                    <TableHead className="text-[13px] font-medium uppercase tracking-wider">Remarks</TableHead>
                                    <TableHead className="text-[13px] font-medium uppercase tracking-wider">Status</TableHead>
                                    <TableHead className="text-[13px] font-medium uppercase tracking-wider">Transaction ID</TableHead>
                                    <TableHead className="text-[13px] font-medium uppercase tracking-wider">Created At</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments?.edges?.map(({ node }: { node: PAYMENT_TYPE }) => (
                                    <TableRow key={node.id}>
                                        <TableCell className="py-4">${toFixed(node.amount)}</TableCell>
                                        <TableCell className="py-4">{node.paymentMethod}</TableCell>
                                        <TableCell className="py-4">{node.remarks}</TableCell>
                                        <TableCell className="py-4">
                                            <Badge className={`${getStatusStyle(node.status)} border-0`}>
                                                {node.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-4">{node.trxId}</TableCell>
                                        <TableCell className="py-4">{moment(node.createdAt).fromNow()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>

                </Card> : ""
            }



            {/* Order Items */}
            <Card className="shadow-sm">
                <CardHeader className="border-b">
                    <CardTitle className="text-lg tracking-tight">Order Items</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-[13px] font-medium uppercase tracking-wider">Product</TableHead>
                                <TableHead className="text-[13px] font-medium uppercase tracking-wider">Quantity</TableHead>
                                <TableHead className="text-[13px] font-medium uppercase tracking-wider">Price</TableHead>
                                <TableHead className="text-[13px] font-medium uppercase tracking-wider">Discount</TableHead>

                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order?.items?.edges?.map(({ node }: ProductNode) => (
                                <TableRow key={node.id}>
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-3">
                                            <Image
                                                src={getThumblain(node?.product?.images)}
                                                alt={node?.product?.name}
                                                width={48}
                                                height={48}
                                                className="rounded-md object-cover"
                                            />
                                            <span className="font-medium">{node?.product?.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">{node?.quantity}</TableCell>
                                    <TableCell className="py-4">${toFixed(node?.price)}</TableCell>
                                    <TableCell className="py-4">${toFixed(discount(node.discount, node.vat))}</TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
    );
};

export default OrderDetails;