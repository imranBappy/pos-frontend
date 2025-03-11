"use client"
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
import { ITEM_DETAILS_QUERY } from '@/graphql/item/queries';
import { Loading } from '@/components/ui';
import Image from '@/components/ui/image';
import { useSearchParams } from 'next/navigation';



export default function ItemDetails() {
    const query = useSearchParams()
    
    const { loading, error, data } = useQuery(ITEM_DETAILS_QUERY, {
        variables: { id: query.get('itemId') },
        skip : !query.get('itemId'),
    });

    if (loading) return <Loading/>;
    if (error) return <p>Error: {error.message}</p>;

    const item = data.item;

    return (
        <div className=" p-4">
            {/* Header Section */}
            <Card className="mb-4">
                <CardContent className="pt-5">
                    <div className="flex gap-20 ">
                        <div>
                            <Image
                                width={200}
                                height={200}
                                src={item.image}
                                alt={item.name}
                                className="w-full rounded-sm h-48 object-cover mb-4"
                            />
                        </div>
                        <div className="flex flex-col gap-2 mt-2">
                            <CardTitle>{item.name}</CardTitle>
                            <p>
                                <strong>SKU:</strong> {item.sku}
                            </p>
                            <p>
                                <strong>Category:</strong>{' '}
                                {item.category?.name || 'N/A'}
                            </p>
                            <p>
                                <strong>VAT:</strong> {item.vat}
                            </p>
                            <p>
                                <strong>Products used:</strong>{' '}
                                {item.ingredients.totalCount}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stock Information */}
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>Stock Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>
                        <strong>Current Stock:</strong> {item.currentStock}
                    </p>
                    <p>
                        <strong>Safety Stock:</strong> {item.safetyStock}
                    </p>
                    <p>
                        <strong>Stock Level:</strong> {item.stockLevel}
                    </p>
                </CardContent>
            </Card>

            {/* Unit Information */}
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>Unit</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>
                        <strong>Name:</strong> {item.unit.name}
                    </p>
                    <p>
                        <strong>Description:</strong> {item.unit.description}
                    </p>
                </CardContent>
            </Card>

            {/* Waste Ingredients */}
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>Waste Ingredients</CardTitle>
                </CardHeader>
                <CardContent>
                    {item.wasteIngredient.totalCount > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Loss Amount</TableHead>
                                    <TableHead>Created At</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {item.wasteIngredient.edges.map(
                                    ({
                                        node,
                                    }: {
                                        node: {
                                            id: string;
                                            quantity: number;
                                            lossAmount: number;
                                            createdAt: string;
                                        };
                                    }) => (
                                        <TableRow key={node.id}>
                                            <TableCell>
                                                {node.quantity}
                                            </TableCell>
                                            <TableCell>
                                                {node.lossAmount}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    node.createdAt
                                                ).toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    )
                                )}
                            </TableBody>
                        </Table>
                    ) : (
                        <p>No waste ingredients.</p>
                    )}
                </CardContent>
            </Card>

            {/* Purchase History */}
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>Purchase History</CardTitle>
                </CardHeader>
                <CardContent>
                    {item.purchaseItems.totalCount > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Supplier</TableHead>
                                    <TableHead>Invoice Number</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>VAT</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {item.purchaseItems.edges.map(
                                    ({
                                        node,
                                    }: {
                                        node: {
                                            id: string;
                                            quantity: number;
                                            vat: number;
                                            price: number;
                                            createdAt: string;
                                            supplierInvoice: {
                                                supplier: { name: string };
                                                invoiceNumber:string,
                                            };
                                        };
                                    }) => (
                                        <TableRow key={node.id}>
                                            <TableCell>
                                                {
                                                    node.supplierInvoice
                                                        ?.supplier?.name
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    node.supplierInvoice
                                                        .invoiceNumber
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {node.quantity}
                                            </TableCell>
                                            <TableCell>{node.price}</TableCell>
                                            <TableCell>{node.vat}</TableCell>
                                        </TableRow>
                                    )
                                )}
                            </TableBody>
                        </Table>
                    ) : (
                        <p>No purchase history.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
