import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useQuery } from "@apollo/client";
import { FilterState } from "@/app/product/components";
import { toast } from "@/hooks/use-toast";
import ProductSkeleton from "@/app/orders/components/pos/product-skeleton";
import { ITEMS_QUERY } from "@/graphql/item/queries";
import ItemCard from "./item-card";
import { ITEM_TYPE } from "@/graphql/item/types";
import useStore from "@/stores";

type POSCategoriesProps = {
  filters: FilterState;
};
const Items = ({ filters }: POSCategoriesProps) => {
  const [pagination] = useState({
    pageIndex: 0,
    pageSize: 30,
  });
  const selectedItems = useStore((store) => store.items);
  const addItem = useStore((store) => store.addItem);

  const handleAddToCart = (item: ITEM_TYPE) => {
    const quantity = selectedItems.get(item.id)?.quantity || 0;
    const vat = selectedItems.get(item.id)?.vat || 0;
    addItem(
      item.id, // key for map
      quantity + 1,
      1,
      selectedItems.get(item.id)?.id,
      item.name,
      vat
    );
  };

  const {
    data: item_res,
    fetchMore,
    loading,
  } = useQuery(ITEMS_QUERY, {
    variables: {
      offset: 0,
      first: pagination.pageSize,
      ...filters,
      isActive: true,
      tag: filters.tag === "ALL" ? "" : filters.tag,
      orderBy: "-createdAt",
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
    pollInterval: 100000,
  });
  const items = item_res?.items?.edges || [];
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
              pageInfo: fetchMoreResult.items.pageInfo,
            },
          };
        },
      });
    } catch (error) {
      console.error("Error fetching more products:", error);
    }
  };

 
  

  const LoadingSkeleton = () => (
    <div className="w-full flex flex-wrap gap-4 p-4">
      {Array(8)
        .fill(0)
        .map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
    </div>
  );
  return (
    <div
      className="h-[calc(100vh-225px)]"
      id="scrollableDiv"
      style={{
        overflow: "auto",
        display: "flex",
        scrollSnapType: "x mandatory",
        scrollBehavior: "smooth",
        cursor: "grab",
      }}
    >
      {items?.length === 0 ? (
        <div className="w-full flex justify-center items-center h-[calc(100vh-225px)]">
          <p className=" text-muted-foreground font-medium text-lg">
            No products found
          </p>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={items?.length}
          next={fetchMoreProducts}
          hasMore={
            !loading &&
            (item_res?.products?.totalCount || 0) > (items?.length || 0)
          }
          loader={Array(8)
            .fill(0)
            .map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          className="flex flex-wrap gap-4 w-full"
          scrollableTarget="scrollableDiv"
        >
          {loading && !item_res ? (
            <LoadingSkeleton />
          ) : (
            items.map(({ node }: { node: ITEM_TYPE }) => (
              <ItemCard
                key={node.id}
                onClick={() => handleAddToCart(node)}
                item={node}
                selected={!!selectedItems.get(node.id)}
              />
            ))
          )}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default Items;
