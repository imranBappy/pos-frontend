import React from 'react';
import ProductDetails from '../../components/product-details';

const page = ({ params }: { params: { id: string } }) => {
    return (
        <div>
            <ProductDetails productId={params.id} />
        </div>
    );
};

export default page;