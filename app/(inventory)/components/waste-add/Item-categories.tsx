import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useContext, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import CategoryCard from '@/app/orders/components/pos/category-card';
import { CATEGORY_TYPE } from '@/graphql/product';
import { SidebarContext } from '@/components/ui/sidebar';
import { useQuery } from '@apollo/client';

import { toast } from '@/hooks/use-toast';
import { FilterState } from '@/app/product/components';
import { ITEM_CATEGORES_QUERY } from '@/graphql/item-category/queries';

type MAP_CATEGORY_TYPE = {
    node: CATEGORY_TYPE
}
const mapCategoryData = (edges: MAP_CATEGORY_TYPE[]): CATEGORY_TYPE[] => edges?.map((item: { node: CATEGORY_TYPE }) => ({
    id: item.node.id,
    name: item.node.name,
    photo: item.node.photo,
    description: item.node.description,
    isActive: item.node.isActive,
    products: item.node.products,
})) || []

type POSCategoriesProps = {
    filters: FilterState,
    handleFilterChange: (key: keyof FilterState) => (value: FilterState[typeof key]) => void
}
const OrderItemCategories = ({ filters, handleFilterChange }: POSCategoriesProps) => {
    const [scrollState, setScrollState] = useState({
        isScrolling: false,
        startX: 0,
        scrollLeft: 0
    });
    const [pagination] = useState({
        pageIndex: 0,
        pageSize: 30,
    })
    const { data: category_res, fetchMore: fetchMoreCategory } = useQuery(ITEM_CATEGORES_QUERY, {
        variables: {
            offset: 0,
            first: pagination.pageSize,
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: (error as Error).message,
                variant: "destructive",
            })
        },

    });

    const itemCategories = mapCategoryData(category_res?.itemCategories?.edges)
    const sidebarContext = useContext(SidebarContext)


    const fetchMoreCategories = async () => {
        try {
            const currentLength = itemCategories.length || 0;
            await fetchMoreCategory({
                variables: {
                    offset: currentLength,
                    first: pagination.pageSize,
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev;
                    return {
                        itemCategories: {
                            __typename: prev.itemCategories.__typename,
                            totalCount: fetchMoreResult.itemCategories.totalCount,
                            edges: [...prev.itemCategories.edges, ...fetchMoreResult.itemCategories.edges],
                            pageInfo: fetchMoreResult.itemCategories.pageInfo
                        }
                    }
                },
            });
        } catch (error) {
            console.error('Error fetching more itemCategories:', error);
        }
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const ele = e.currentTarget;
        setScrollState({
            isScrolling: true,
            startX: e.pageX - ele.offsetLeft,
            scrollLeft: ele.scrollLeft
        });
        ele.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!scrollState.isScrolling) return;

        const ele = e.currentTarget;
        const x = e.pageX - ele.offsetLeft;
        const walk = (x - scrollState.startX) * 2;

        ele.scrollLeft = scrollState.scrollLeft - walk;

        setScrollState(prev => ({
            ...prev,
            scrollLeft: ele.scrollLeft,
            startX: x
        }));
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        setScrollState(prev => ({ ...prev, isScrolling: false }));
        e.currentTarget.style.cursor = 'grab';
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        setScrollState(prev => ({ ...prev, isScrolling: false }));
        e.currentTarget.style.cursor = 'grab';
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        const ele = e.currentTarget;
        setScrollState({
            isScrolling: true,
            startX: e.touches[0].pageX - ele.offsetLeft,
            scrollLeft: ele.scrollLeft
        });
        ele.style.cursor = 'grabbing';
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!scrollState.isScrolling) return;

        const ele = e.currentTarget;
        const x = e.touches[0].pageX - ele.offsetLeft;
        const walk = (x - scrollState.startX) * 2;

        ele.scrollLeft = scrollState.scrollLeft - walk;

        setScrollState(prev => ({
            ...prev,
            scrollLeft: ele.scrollLeft,
            startX: x
        }));

        e.preventDefault();
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        setScrollState(prev => ({ ...prev, isScrolling: false }));
        e.currentTarget.style.cursor = 'grab';
    };
    return (
        <div className={cn("relative", sidebarContext?.open ? "w-[calc(100vw-754px)]" : "w-[calc(100vw-547px)]")}>
            <button
                onClick={() => {
                    const ele = document.getElementById('categoryScroll');
                    if (ele) ele.scrollLeft -= 200;
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm p-1 rounded-full shadow hover:bg-background"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>
            <div
                className="overflow-x-auto mb-3 ml-8 w-full scrollbar-hide"
                id="categoryScroll"
                style={{
                    overflowX: 'auto',
                    WebkitOverflowScrolling: 'touch',
                    scrollSnapType: 'none',
                    cursor: scrollState.isScrolling ? 'grabbing' : 'grab',
                    touchAction: 'pan-x',
                    userSelect: 'none'
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onWheel={(e) => {
                    if (e.deltaY !== 0) {
                        e.preventDefault();
                        e.currentTarget.scrollLeft += e.deltaY;
                    }
                }}
            >
                <style jsx global>{`
                                #categoryScroll::-webkit-scrollbar {
                                    display: none;
                                }
                            `}</style>
                <InfiniteScroll
                    scrollableTarget="categoryScroll"
                    dataLength={itemCategories.length || 0}
                    next={fetchMoreCategories}
                    hasMore={(category_res?.itemCategories?.totalCount || 0) > (itemCategories.length || 0)}
                    loader={<div className="flex gap-2">
                        {Array(3).fill(0).map((_, index) => (
                            <div key={index} className="w-24 h-10 bg-muted animate-pulse rounded-md" />
                        ))}
                    </div>}
                    className="flex gap-2"
                    style={{ overflow: 'visible' }}
                >
                    <CategoryCard
                        label='All Items'
                        onClick={() => handleFilterChange("category")(null)}
                        variant={filters.category === null ? "default" : "secondary"}
                    />
                    {itemCategories.map((item: CATEGORY_TYPE) => (
                        <CategoryCard
                            variant={item.id === filters.category ? "default" : "secondary"}
                            key={item.id}
                            onClick={() => handleFilterChange("category")(item.id)}
                            label={item.name}
                        />
                    ))}
                </InfiniteScroll>
            </div>
            <button
                onClick={() => {
                    const ele = document.getElementById('categoryScroll');
                    if (ele) ele.scrollLeft += 200;
                }}
                className="absolute -right-16 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm p-1 rounded-full shadow hover:bg-background"
            >
                <ChevronRight className="h-5 w-5" />
            </button>
        </div>
    );
};

export default OrderItemCategories;