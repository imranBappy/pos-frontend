"use client"
import { useQuery } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { PRODUCT_DETAILS_QUERY, PRODUCT_TYPE } from '@/graphql/product';
import { getThumblain, toFixed } from '@/lib/utils';
import Image from '@/components/ui/image';

interface ProductPageProps {
    productId: string;
}
const ProductDetails = ({ productId }: ProductPageProps) => {
    const { data, loading, error } = useQuery<{ product: PRODUCT_TYPE }>(
        PRODUCT_DETAILS_QUERY,
        {
            variables: { id: productId },
        }
    );

    if (loading) {
        return (
            <div className="container mx-auto py-8">
                <Skeleton className="h-12 w-1/2 mb-4" />
                <Skeleton className="h-64 w-full mb-4" />
                <Skeleton className="h-24 w-full" />
            </div>
        );
    }

    if (error || !data?.product) {
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardContent className="p-6">
                        <p className="text-red-500">
                            {error ? error.message : 'Product not found'}
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const product: PRODUCT_TYPE = data.product;

    return (
        <div className="container mx-auto py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Media */}
                <Card>
                    <CardContent className="p-6 flex items-center justify-center ">
                        {product.video ? (
                            <video
                                src={product.video}
                                controls
                                className="w-full rounded-md"
                            />
                        ) : product.images ? (
                            <Image
                                src={getThumblain(product.images)}
                                alt={product.name}
                                width={500}
                                height={500}
                                className="object-cover rounded-md   h-96 "
                            />
                        ) : (
                            <div className="w-full h-64 bg-gray-200 rounded-md flex items-center justify-center">
                                <p className="text-muted-foreground">
                                    No media available
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Product Details */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold">{product.name}</h1>
                        <Badge
                            variant={product.isActive ? 'default' : 'secondary'}
                        >
                            {product.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Product Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        SKU
                                    </p>
                                    <p>{product.sku}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Price
                                    </p>
                                    <p>${product.price.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        VAT
                                    </p>
                                    <p>{product.vat}%</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Cooking Time
                                    </p>
                                    <p>{product.cookingTime}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Kitchen
                                    </p>
                                    <p>{typeof product.kitchen === 'object' ? product?.kitchen?.name : ""}</p>
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Description
                                </p>
                                <p>{product.description}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Category
                                </p>
                                <p>{typeof product.category === 'object' ? product?.category?.name : ""}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Subcategory
                                </p>
                                <p>{typeof product.subcategory === 'object' ? product?.subcategory?.name : ""}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Ingredients Section */}
            {(product?.ingredients?.totalCount || 0) > 0 && (
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>
                            Ingredients ({product?.ingredients?.totalCount ||0})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {product?.ingredients?.edges.map((edge) => (
                                <div
                                    key={edge.node.id}
                                    className="grid grid-cols-3 gap-4"
                                >
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Name
                                        </p>
                                        <p>{edge.node.item.name}</p>
                                    </div>
                                   
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Quantity
                                        </p>
                                        <p>{edge.node.quantity}</p>
                                    </div>
                                    <div>
                                        {edge.node.item.image && (
                                            <Image
                                                src={edge.node.item.image}
                                                alt={edge.node.item.name}
                                                width={50}
                                                height={50}
                                                className="object-cover rounded-md"
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Orders Section */}
            {product?.orders?.totalCount  && (
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>
                            Recent Orders ({product.orders.totalCount})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {product.orders.edges.map((edge) => (
                                <div
                                    key={edge.node.id}
                                    className="grid grid-cols-4 gap-4"
                                >
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Order ID
                                        </p>
                                        <p>{edge.node?.order?.orderId}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Status
                                        </p>
                                        <p>{edge.node.order.status}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Price
                                        </p>
                                        <p>${toFixed(edge.node.price)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Quantity
                                        </p>
                                        <p>{edge.node.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ProductDetails;
