'use client';
import { useQuery } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from '@/components/ui/image';
import {  PAYMENT_TYPE } from '@/graphql/product';
import { Loading } from '@/components/ui';
import {  getStatusStyle,  toFixed } from '@/lib/utils';
import moment from 'moment';
import { SUPPLIER_INVOICE_QUERY } from '@/graphql/supplier-invoice/queries';
import SupplierPaymentModalWrap from './data-tables/supplier-invoice-data-table/supplier-payment-modal-wrap';
import { ORDER_STATUSES } from '@/constants/order.constants';

interface ProductNode {
    node: {
        item: {
            name: string;
            image: string;
        };
        id: string;
        product: {
            name: string;
            images: string;
            price: number;
        };
        totalQuantity:number;
        quantity: number;
        price: number;
        discount: number;
        vat: number;
    };
}
export const InvoiceDetails = ({ invoiceId }: { invoiceId: string }) => {
    const { data, loading, error } = useQuery(SUPPLIER_INVOICE_QUERY, {
        variables: { id: Number(invoiceId) },
    });
  
  
    if (loading) return <Loading />;
    if (error) return <div>Error: {error.message}</div>;

    const supplierInvoice = data.supplierInvoice;
    const supplier = supplierInvoice?.supplier;
    const payments = supplierInvoice?.payments.edges;
    const invoiceImage  = supplierInvoice?.invoiceImage;


    return (
        <div className="space-y-6 p-4">
            {/* Supplier Information */}
            <div className=" justify-end flex gap-2">
                <SupplierPaymentModalWrap
                    disabled={
                        supplierInvoice.status === ORDER_STATUSES.COMPLETED
                    }
                    invoiceId={supplierInvoice.id}
                />
            </div>
            <Card className="shadow-sm">
                <CardHeader className="border-b">
                    <CardTitle className="text-lg tracking-tight">
                        Supplier Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 border">
                                <AvatarImage src={supplier?.photo || ''} />
                                <AvatarFallback>
                                    {supplierInvoice?.supplier?.name[0] || 'w'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <p className="font-medium tracking-tight">
                                    {supplier?.name || 'Walk-in Customer'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {supplier?.emailAddress ||
                                        'No email address'}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-10">
                            <div className="space-y-2">
                                <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">
                                    Contact Person
                                </p>
                                <p>{supplier?.contactPerson || '-'}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">
                                    Phone Number
                                </p>
                                <p>{supplier?.phoneNumber || '-'}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">
                                    Whatsapp Number
                                </p>
                                <p>{supplier?.whatsappNumber || '-'}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">
                                    branch
                                </p>
                                <p className="font-medium">
                                    {supplier?.branch || '-'}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">
                                    Address
                                </p>
                                <p>{supplier?.address || '-'}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Invoice Information */}
            <Card className="shadow-sm">
                <CardHeader className="border-b">
                    <CardTitle className="text-lg tracking-tight">
                        <div className="flex justify-between items-center">
                            <p>Invoice Information</p>
                            <Badge
                                className={`${getStatusStyle(
                                    supplierInvoice.status
                                )} border-0`}
                            >
                                {supplierInvoice.status}
                            </Badge>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">
                                Invoice Number
                            </p>
                            <p className="font-medium">
                                {supplierInvoice?.invoiceNumber}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">
                                Total Amount
                            </p>
                            <p className="font-medium">
                                ${toFixed(supplierInvoice?.finalAmount)}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">
                                Amount
                            </p>
                            <p className="font-medium">
                                {toFixed(supplierInvoice?.amount)}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">
                                Paid Amount
                            </p>
                            <p>{toFixed(supplierInvoice?.paidAmount)}</p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">
                                Due Amount
                            </p>
                            <p className="font-medium">
                                ${toFixed(supplierInvoice?.due)}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">
                                Due Payment Date
                            </p>
                            <p>
                                {supplierInvoice.duePaymentDate
                                    ? moment(
                                          supplierInvoice?.duePaymentDate
                                      ).format('MMM Do YY')
                                    : '-'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {/* Payment */}

            {payments?.length ? (
                <Card className="shadow-sm">
                    <CardHeader className="border-b">
                        <CardTitle className="text-lg tracking-tight">
                            Payment
                        </CardTitle>
                    </CardHeader>

                    {/* array of payment */}
                    <CardContent className="pt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-[13px] font-medium uppercase tracking-wider">
                                        Amount
                                    </TableHead>
                                    <TableHead className="text-[13px] font-medium uppercase tracking-wider">
                                        Payment Method
                                    </TableHead>
                                    <TableHead className="text-[13px] font-medium uppercase tracking-wider">
                                        Status
                                    </TableHead>
                                    <TableHead className="text-[13px] font-medium uppercase tracking-wider">
                                        Transaction ID
                                    </TableHead>
                                    <TableHead className="text-[13px] font-medium uppercase tracking-wider">
                                        Created At
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments?.map(
                                    ({ node }: { node: PAYMENT_TYPE }) => (
                                        <TableRow key={node.id}>
                                            <TableCell className="py-4">
                                                ${toFixed(node.amount)}
                                            </TableCell>
                                            <TableCell className="py-4">
                                                {node.paymentMethod}
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <Badge
                                                    className={`${getStatusStyle(
                                                        node.status
                                                    )} border-0`}
                                                >
                                                    {node.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                {node.trxId}
                                            </TableCell>
                                            <TableCell className="py-4">
                                                {node.createdAt
                                                    ? moment(
                                                          node.createdAt
                                                      ).fromNow()
                                                    : '_'}
                                            </TableCell>
                                        </TableRow>
                                    )
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            ) : (
                ''
            )}

            {/* Parchage Items */}
            <Card className="shadow-sm">
                <CardHeader className="border-b">
                    <CardTitle className="text-lg tracking-tight">
                        Parchage Items
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-[13px] font-medium uppercase tracking-wider">
                                    Product
                                </TableHead>
                                <TableHead className="text-[13px] font-medium uppercase tracking-wider">
                                    Quantity
                                </TableHead>
                                <TableHead className="text-[13px] font-medium uppercase tracking-wider">
                                    Current Quantity
                                </TableHead>
                                <TableHead className="text-[13px] font-medium uppercase tracking-wider">
                                    Price
                                </TableHead>
                                <TableHead className="text-[13px] font-medium uppercase tracking-wider">
                                    Vat
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {supplierInvoice?.purchaseItems?.edges?.map(
                                ({ node }: ProductNode) => (
                                    <TableRow key={node.id}>
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-3">
                                                <Image
                                                    src={node?.item?.image}
                                                    alt={node?.item?.name}
                                                    width={48}
                                                    height={48}
                                                    className="rounded-md object-cover"
                                                />
                                                <span className="font-medium">
                                                    {node?.item?.name}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            {toFixed(node?.totalQuantity)}
                                        </TableCell>
                                        <TableCell className="py-4">
                                            {toFixed(node?.quantity)}
                                        </TableCell>
                                        <TableCell className="py-4">
                                            ${toFixed(node?.price)}
                                        </TableCell>
                                        <TableCell className="py-4">
                                            ${toFixed(node?.vat) || 0}
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Invoice Image */}
            {invoiceImage && (
                <Card className="shadow-sm">
                    <CardHeader className="border-b">
                        <CardTitle className="text-lg tracking-tight">
                            Invoice Image
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 flex justify-center ">
                        <Image
                            src={invoiceImage}
                            alt="invoice"
                            width={800}
                            height={800}
                            className="rounded-md object-cover  "
                        />
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default InvoiceDetails;
