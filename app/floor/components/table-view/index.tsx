"use client"
import React, { useContext, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { ChevronRight } from "lucide-react";
import InfiniteScroll from 'react-infinite-scroll-component';
import { FLOOR_TYPE, FLOOR_TABLES_QUERY, FLOORS_QUERY, FLOOR_TABLES_TYPE } from '@/graphql/product';

import { cn } from '@/lib/utils';
import { Card } from "@/components/ui/card";
import CategoryCard from './category-card';
import { toast } from '@/hooks/use-toast';
import ProductSkeleton from './product-skeleton';
import { SidebarContext } from '@/components/ui/sidebar';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import TableCard from './table-card';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/button';
import useStore from '@/stores';


export interface FilterState {
    search: string;
    floor: number | null | string;
    orderBy: string;
}

type FLOOR_NODE_TYPE = {
    node: FLOOR_TYPE
}

export const mapFloorsData = (edges: FLOOR_NODE_TYPE[]): FLOOR_TABLES_TYPE[] =>
    edges?.map(({ node }: FLOOR_NODE_TYPE) => ({
        id: node.id,
        name: node.name,
        createdAt: node.createdAt,
        isActive: node.isActive,
        isBooked: node.isBooked,
        floorTables: node.floorTables
    })) || [];


const TableView = () => {
    const [pagination] = useState({
        pageIndex: 0,
        pageSize: 30,
    })
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        floor: null,
        orderBy: '',
    })
    const debouncedSearch = useDebouncedValue(filters.search, 500);

    const tableState = useStore((store) => store.table)
    const addTable = useStore((store) => store.addTable)
    const removeTable = useStore((store) => store.removeTable)




    const sidebarContext = useContext(SidebarContext)
    const router = useRouter()

    const { data: floors_res, fetchMore: fetchMoreFloor } = useQuery(FLOORS_QUERY, {
        variables: {
            offset: 0,
            first: pagination.pageSize,
            isActive: true,
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            })
        },

    });
    const floors = mapFloorsData(floors_res?.floors?.edges)

    const { data: floorTables_res, fetchMore, loading } = useQuery(FLOOR_TABLES_QUERY, {
        variables: {
            offset: 0,
            first: pagination.pageSize,
            ...filters,
            isActive: true,
            orderBy: '-createdAt',
        },
        pollInterval: 60000, //millisecond
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            })
        }
    }
    );
    const tables = mapFloorsData(floorTables_res?.floorTables?.edges)

    const handleFilterChange = (key: keyof FilterState) => (value: FilterState[typeof key]) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
        }))
    }


    const handleAddToCart = (table: FLOOR_TABLES_TYPE) => {
        if (!table.id) return;
        if (table.isBooked) return;
        if (!table.isActive) return;
        const isExist = tableState?.find((item: FLOOR_TYPE) => item.id == table.id)
        if (isExist) {
            removeTable(table.id)
            return
        }
        addTable(table);
    }

    const fetchMoreTables = async () => {
        try {
            const currentLength = tables.length;
            await fetchMore({
                variables: {
                    offset: currentLength,
                    first: pagination.pageSize,
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev;
                    return {
                        floorTables: {
                            __typename: prev.floorTables.__typename,
                            totalCount: fetchMoreResult.floorTables.totalCount,
                            edges: [...prev.floorTables.edges, ...fetchMoreResult.floorTables.edges],
                            pageInfo: fetchMoreResult.floorTables.pageInfo
                        }
                    };
                }
            });
        } catch (error) {
            console.error('Error fetching more products:', error);
        }
    };
    const fetchMoreFloors = async () => {
        try {
            const currentLength = floors.length || 0;
            await fetchMoreFloor({
                variables: {
                    offset: currentLength,
                    first: pagination.pageSize,
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev;
                    return {
                        floors: {
                            __typename: prev.floors.__typename,
                            totalCount: fetchMoreResult.floors.totalCount,
                            edges: [...prev.floors.edges, ...fetchMoreResult.floors.edges],
                            pageInfo: fetchMoreResult.floors.pageInfo
                        }
                    }
                },
            });
        } catch (error) {
            console.error('Error fetching more categories:', error);
        }
    };

    const [scrollState, setScrollState] = useState({
        isScrolling: false,
        startX: 0,
        scrollLeft: 0
    });

    // scroll 
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

    const handleNext = () => {
        router.push('/orders/pos')
    }


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
    const LoadingSkeleton = () => (
        <div className="w-full flex flex-wrap gap-4 p-4">
            {Array(8).fill(0).map((_, index) => (
                <ProductSkeleton key={index} />
            ))}
        </div>
    );

    useEffect(() => {
        handleFilterChange("search")(debouncedSearch || '');
    }, [debouncedSearch]);

    return (
        <div className="w-full h-[calc(100vh-100px)] flex gap-4">
            <div className={cn("h-full", sidebarContext?.open ? "w-[calc(100vw-300px)]" : "w-[calc(100vw-85px)]")}>
                <Card className=" p-3">
                    {/* Categories Section */}

                    <div className={cn("relative", sidebarContext?.open ? "w-[calc(100vw-389px)]" : "w-[calc(100vw-180px)]")}>
                        {/* <button
                            onClick={() => {
                                const ele = document.getElementById('categoryScroll');
                                if (ele) ele.scrollLeft -= 200;
                            }}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm p-1 rounded-full shadow hover:bg-background"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button> */}

                        <div
                            className="overflow-x-auto mb-3 mt-1 ml-8 w-full scrollbar-hide"
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
                                dataLength={floors.length || 0}
                                next={fetchMoreFloors}
                                hasMore={(floors_res?.floors?.totalCount || 0) > (floors.length || 0)}
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
                                    onClick={() => handleFilterChange("floor")(null)}
                                    variant={filters.floor === null ? "default" : "secondary"}
                                />
                                {floors.map((item: FLOOR_TYPE) => (
                                    <CategoryCard
                                        variant={item.id === filters.floor ? "default" : "secondary"}
                                        key={item.id}
                                        onClick={() => handleFilterChange("floor")(item.id)}
                                        label={item.name}
                                    />
                                ))}
                            </InfiniteScroll>
                        </div>
                        {(floors_res?.floors?.totalCount || 0) > (floors.length || 0) && <button
                            onClick={() => {
                                const ele = document.getElementById('categoryScroll');
                                if (ele) ele.scrollLeft += 200;
                            }}
                            className="absolute -right-16 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm p-1 rounded-full shadow hover:bg-background"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>

                        }

                    </div>
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
                            tables.length === 0 ? (
                                <div className="w-full flex justify-center items-center h-[calc(100vh-225px)]">
                                    <p className=" text-muted-foreground font-medium text-lg">
                                        No products found
                                    </p>
                                </div>
                            ) : (
                                <InfiniteScroll
                                    dataLength={tables.length}
                                    next={fetchMoreTables}
                                    hasMore={
                                        !loading &&
                                        (floorTables_res?.floorTables?.totalCount || 0) >
                                        (tables?.length || 0)
                                    }
                                    loader={Array(8).fill(0).map((_, index) => (
                                        <ProductSkeleton key={index} />
                                    ))}
                                    className='flex flex-wrap gap-4 w-full'
                                    scrollableTarget="scrollableDiv"

                                >
                                    {loading && !floorTables_res ? (
                                        <LoadingSkeleton />
                                    ) : (

                                        tables.map((item: FLOOR_TYPE) => (
                                            <TableCard
                                                key={item.id}
                                                onClick={() => handleAddToCart(item)}
                                                isBooked={item.isBooked}
                                                name={item.name}
                                                floor={item?.floorTables?.name}
                                                selected={tableState?.some((cartItem: FLOOR_TYPE) => cartItem.id == item.id)}
                                            />
                                        ))

                                    )}
                                </InfiniteScroll>
                            )
                        }
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <Button disabled={tableState?.length === 0} onClick={() => { handleNext() }} className="w-full mt-4">Next {tableState.length}</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default TableView;