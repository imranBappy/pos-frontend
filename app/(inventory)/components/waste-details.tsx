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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from '@/components/ui/image';
import { Loading } from '@/components/ui';
import {  toFixed } from '@/lib/utils';
import moment from 'moment';
import { WASTE_QUERY } from '@/graphql/waste/queries';
import Link from 'next/link';

interface ProductNode {
    node: {
        ingredient: {
            name: string;
            image: string;
            lossAmount: number;
        };
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
export const WasteDetails = ({  wasteId }: { wasteId: string }) => {
    console.log({ wasteId });
    
    const { data, loading, error } = useQuery(WASTE_QUERY, {
        variables: { id: wasteId },
    });

    if (loading) return <Loading />;
    if (error) return <div>Error: {error.message}</div>;

    const waste = data.waste;
    const responsible = waste?.responsible;
    console.log({ responsible });
    

    return (
        <div className="space-y-6 p-4">
            {/* Supplier Information */}

            <Card className="shadow-sm">
                <CardHeader className="border-b">
                    <CardTitle className="text-lg tracking-tight">
                        Responsible Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12 border">
                                <AvatarImage src={responsible?.photo || ''} />
                                <AvatarFallback>
                                    {waste?.supplier?.name[0] || 'w'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <p className="font-medium tracking-tight">
                                    {responsible?.name || 'Walk-in Customer'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {responsible?.email || 'No email address'}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-10">
                            <div className="space-y-2">
                                <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">
                                    Phone
                                </p>
                                <p>{responsible?.phone || '-'}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">
                                    Gender
                                </p>
                                <p>{responsible?.gender || '-'}</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">
                                    Role
                                </p>
                                <p>{responsible?.role?.name || '-'}</p>
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
                            <p>Waste Information</p>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">
                                Category
                            </p>
                            <p className="font-medium">
                                {waste?.category?.name}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">
                                Total loss Amount
                            </p>
                            <p className="font-medium">
                                ${toFixed(waste?.estimatedCost)}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">
                                Lossed Date
                            </p>
                            <p className="font-medium">
                                {moment(waste?.date).format('MMM Do YY')}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">
                                Notes
                            </p>
                            <p>{waste?.notes}</p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">
                                Invoice
                            </p>
                            <p className="font-medium">
                                <Link
                                    href={`/supplier-invoices/${
                                        waste?.invoice?.id || '#'
                                    }`}
                                >
                                    {waste?.invoice?.invoiceNumber}
                                </Link>
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-wider">
                                Supplier
                            </p>
                            <p>
                                {waste?.invoice?.supplier?.name ||
                                    'Walk-in supplier'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {/* Payment */}

            {/* Parchage Items */}
            <Card className="shadow-sm">
                <CardHeader className="border-b">
                    <CardTitle className="text-lg tracking-tight">
                        Waste Items
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-[13px] font-medium uppercase tracking-wider">
                                    Ingredient
                                </TableHead>
                                <TableHead className="text-[13px] font-medium uppercase tracking-wider">
                                    Quantity
                                </TableHead>
                                <TableHead className="text-[13px] font-medium uppercase tracking-wider">
                                    LossAmount
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {waste?.wasteIngredient?.edges?.map(
                                ({ node }: ProductNode) => (
                                    <TableRow key={node.id}>
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-3">
                                                <Image
                                                    src={node?.ingredient?.image}
                                                    alt={node?.ingredient?.name}
                                                    width={48}
                                                    height={48}
                                                    className="rounded-md object-cover"
                                                />
                                                <span className="font-medium">
                                                    {node?.ingredient?.name}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            {node?.quantity}
                                        </TableCell>
                                        <TableCell className="py-4">
                                            ${toFixed(node.ingredient.lossAmount)}
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default WasteDetails;
