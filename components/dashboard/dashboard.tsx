"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import InfoCard from './info-card';
import { DASHBOARD_QUERIES } from '@/graphql/dashboard/queries';
import { useQuery } from '@apollo/client';
import { Loading } from '../ui';
import { USER_TYPE } from '@/graphql/accounts';
import moment from 'moment';
import { ORDER_TYPE, PRODUCT_TYPE } from '@/graphql/product';
import { getStatusStyle, itemStockStatus, toFixed, underscoreToSpace } from '@/lib/utils';
import { ITEM_TYPE } from '@/graphql/item/types';
import ItemStockStatus from '../item-stock-status';
import { Badge } from '../ui/badge';


export default function Dashboard() {

    const { data, loading, error } = useQuery(DASHBOARD_QUERIES);
    const {
        outlets,
        users,
        orders,
        payments,
        products,
        categories,
        items,
        wastes,
        floors,
        floorTables,
    } = data || {};
    

    if(loading) return <Loading/>
    if(error) return <p>Error: {error.message}</p>

    return (
        <div className="w-full p-4 mx-auto space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <InfoCard
                    title="Total Outlers"
                    value={outlets?.totalCount || 0}
                />
                <InfoCard
                    title="Total Customers"
                    value={users?.totalCount || 0}
                />
                <InfoCard
                    title="Total Orders"
                    value={orders?.totalCount || 0}
                />
                <InfoCard
                    title="Total Payments"
                    value={payments?.totalCount || 0}
                />
                <InfoCard
                    title="Total Products"
                    value={products?.totalCount || 0}
                />
                <InfoCard
                    title="Total Categories"
                    value={categories?.totalCount || 0}
                />

                <InfoCard title="Total items" value={items?.totalCount || 0} />
                <InfoCard
                    title="Total Wastes"
                    value={wastes?.totalCount || 0}
                />
                <InfoCard
                    title="Total Floors"
                    value={floors?.totalCount || 0}
                />
                <InfoCard
                    title="Total Table"
                    value={floorTables?.totalCount || 0}
                />
            </div>

            {/* Order Table */}
            <Card>
                <CardHeader>
                    <CardTitle>New Order</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Total Item</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders?.edges?.map(
                                ({ node }: { node: ORDER_TYPE }) => (
                                    <TableRow key={node.id}>
                                        <TableCell>
                                            {node.orderId || '_'}
                                        </TableCell>
                                        <TableCell>
                                            {node?.user?.name ||
                                                '	Walk-in Customer'}
                                        </TableCell>
                                        <TableCell>
                                            {toFixed(node.finalAmount)}
                                        </TableCell>
                                        <TableCell>
                                            {underscoreToSpace(node.type)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={`${getStatusStyle(
                                                    node.status
                                                )} border-none w-[90px]  flex justify-center items-center`}
                                            >
                                                {node.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {moment(node.createdAt).format(
                                                'MMM DD, YYYY'
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Customers Table */}
            <Card>
                <CardHeader>
                    <CardTitle>New Customers</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Joined Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users?.edges?.map(
                                ({ node }: { node: USER_TYPE }) => (
                                    <TableRow key={node.id}>
                                        <TableCell>
                                            {node.name || '_'}
                                        </TableCell>
                                        <TableCell>{node.email}</TableCell>
                                        <TableCell>
                                            {node.phone || '_'}
                                        </TableCell>
                                        <TableCell>
                                            {moment(node.createdAt).format(
                                                'MMM DD, YYYY'
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Products Table */}
            <Card>
                <CardHeader>
                    <CardTitle>New Products</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Sales</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Ingredients</TableHead>
                                <TableHead>Created At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products?.edges?.map(
                                ({ node }: { node: PRODUCT_TYPE }) => (
                                    <TableRow key={node.id}>
                                        <TableCell>{node.name}</TableCell>
                                        <TableCell>
                                            {toFixed(node.price)}
                                        </TableCell>
                                        <TableCell>
                                            {node?.orders?.totalCount}
                                        </TableCell>
                                        <TableCell>
                                            {typeof node?.category === 'object'
                                                ? node?.category?.name || '_'
                                                : ''}
                                        </TableCell>
                                        <TableCell>
                                            {node.ingredients?.totalCount}
                                        </TableCell>
                                        <TableCell>
                                            {moment(node.createdAt).format(
                                                'MMM DD, YYYY'
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Items Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Inventory Items</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Current Stock</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items?.edges?.map(
                                ({ node }: { node: ITEM_TYPE }) => (
                                    <TableRow key={node.id}>
                                        <TableCell>{node.name}</TableCell>
                                        <TableCell>{node.stock}</TableCell>
                                        <TableCell>
                                            {toFixed(node?.currentStock, 3)}
                                        </TableCell>
                                        <TableCell>
                                            {node?.category?.name}
                                        </TableCell>
                                        <TableCell className="flex items-center">
                                            <ItemStockStatus
                                                status={(() => {
                                                    return itemStockStatus(
                                                        node.stock,
                                                        node.safetyStock
                                                    );
                                                })()}
                                            />
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
}