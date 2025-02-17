import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useQuery } from '@apollo/client';
import { FilterState } from '@/app/product/components';
import { toast } from '@/hooks/use-toast';
import ProductSkeleton from '@/app/orders/components/pos/product-skeleton';
import { ITEMS_QUERY } from '@/graphql/item/queries';
import ItemCard from './item-card';
import { ITEM_TYPE } from '@/graphql/item/types';
import { getThumblain } from '@/lib/utils';

const mapProductData = (edges: { node: ITEM_TYPE }[]) => edges?.map((item: { node: ITEM_TYPE }) => ({
    id: item.node.id,
    name: item.node.name,
    stock: item.node.stock,
    unit: item.node.unit.name,
    images: getThumblain("")
})) || []

type POSCategoriesProps = {
    filters: FilterState,
    handleAddToCart: (product: ITEM_TYPE) => void,
    cart: ITEM_TYPE[]
}
const Items = ({ filters, handleAddToCart, cart }: POSCategoriesProps) => {
    const [pagination] = useState({
        pageIndex: 0,
        pageSize: 30,
    })
    const { data: product_res, fetchMore, loading } = useQuery(ITEMS_QUERY, {
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
    const items = mapProductData(product_res?.items?.edges)
    const fetchMoreProducts = async () => {
        try {
            const currentLength = items.length;
            await fetchMore({
                variables: {
                    offset: currentLength,
                    first: pagination.pageSize,
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev;
                    return {
                        items: {
                            __typename: prev.items.__typename,
                            totalCount: fetchMoreResult.items.totalCount,
                            edges: [...prev.items.edges, ...fetchMoreResult.items.edges],
                            pageInfo: fetchMoreResult.items.pageInfo
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
                items.length === 0 ? (
                    <div className="w-full flex justify-center items-center h-[calc(100vh-225px)]">
                        <p className=" text-muted-foreground font-medium text-lg">
                            No products found
                        </p>
                    </div>
                ) : (
                    <InfiniteScroll
                        dataLength={items.length}
                        next={fetchMoreProducts}
                        hasMore={
                            !loading &&
                            (product_res?.products?.totalCount || 0) >
                            (items?.length || 0)
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
                            items.map((item) => (
                                <ItemCard
                                    key={item.id}
                                    onClick={() => handleAddToCart(item)}
                                    name={item.name}
                                    stock={item.stock}
                                    unit={item.unit}

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

export default Items;