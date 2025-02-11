const ProductSkeleton = () => {
    return (
        <div className="w-[180px] p-4 rounded-lg border bg-card animate-pulse">
            <div className="w-full h-32 bg-muted rounded-md mb-3" />
            <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
            </div>
        </div>
    );
};

export default ProductSkeleton; 