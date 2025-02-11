import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import ProductSkeleton from './product-skeleton';
import { useQuery } from '@apollo/client';
import { PRODUCT_TYPE, PRODUCTS_QUERY } from '@/graphql/product';
import { getThumblain } from '@/lib/utils';
import { FilterState } from '@/app/product/components';
import { toast } from '@/hooks/use-toast';
import ProductCard from './product-card';

const mapProductData = (edges: { node: PRODUCT_TYPE }[]) => edges?.map((item: { node: PRODUCT_TYPE }) => ({
    id: item.node.id,
    name: item.node.name,
    price: item.node.price,
    vat: item.node.vat,
    images: getThumblain(item.node.images || "")
})) || []

type POSCategoriesProps = {
    filters: FilterState,
    handleAddToCart: (product: PRODUCT_TYPE) => void,
    cart: PRODUCT_TYPE[]
}
const POSProducts = ({ filters, handleAddToCart, cart }: POSCategoriesProps) => {
    const [pagination] = useState({
        pageIndex: 0,
        pageSize: 30,
    })
    const { data: product_res, fetchMore, loading } = useQuery(PRODUCTS_QUERY, {
        variables: {
            offset: 0,
            first: pagination.pageSize,
            ...filters,
            isActive: true,
            tag: filters.tag === 'ALL' ? '' : filters.tag,
            orderBy: '-createdAt',
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: (error as Error).message,
                variant: "destructive",
            })
        }
    }
    );
    const products = mapProductData(product_res?.products?.edges)
    const fetchMoreProducts = async () => {
        try {
            const currentLength = products.length;
            await fetchMore({
                variables: {
                    offset: currentLength,
                    first: pagination.pageSize,
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev;
                    return {
                        products: {
                            __typename: prev.products.__typename,
                            totalCount: fetchMoreResult.products.totalCount,
                            edges: [...prev.products.edges, ...fetchMoreResult.products.edges],
                            pageInfo: fetchMoreResult.products.pageInfo
                        }
                    };
                }
            });
        } catch (error) {
            console.error('Error fetching more products:', error);

        }
    };

    const LoadingSkeleton = () => (
        <div className="w-full flex flex-wrap gap-4 p-4">
            {Array(8).fill(0).map((_, index) => (
                <ProductSkeleton key={index} />
            ))}
        </div>
    );
    return (
        <div
            className='h-[calc(100vh-225px)]'
            id="scrollableDiv"
            style={{
                overflow: 'auto',
                display: 'flex',
                scrollSnapType: 'x mandatory',
                scrollBehavior: 'smooth',
                cursor: 'grab',
            }}
        >
            {
                products.length === 0 ? (
                    <div className="w-full flex justify-center items-center h-[calc(100vh-225px)]">
                        <p className=" text-muted-foreground font-medium text-lg">
                            No products found
                        </p>
                    </div>
                ) : (
                    <InfiniteScroll
                        dataLength={products.length}
                        next={fetchMoreProducts}
                        hasMore={
                            !loading &&
                            (product_res?.products?.totalCount || 0) >
                            (products?.length || 0)
                        }
                        loader={Array(8).fill(0).map((_, index) => (
                            <ProductSkeleton key={index} />
                        ))}
                        className='flex flex-wrap gap-4 w-full'
                        scrollableTarget="scrollableDiv"

                    >
                        {loading && !product_res ? (
                            <LoadingSkeleton />
                        ) : (
                            products.map((item) => (
                                <ProductCard
                                    key={item.id}
                                    onClick={() => handleAddToCart(item)}
                                    name={item.name}
                                    price={item.price}
                                    image={item.images}
                                    selected={cart?.some(cartItem => cartItem.id === item.id)}
                                />
                            ))
                        )}
                    </InfiniteScroll>
                )
            }
        </div>
    );
};

export default POSProducts;