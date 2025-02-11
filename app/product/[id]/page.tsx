import React from 'react';
import { ProductForm } from '@/app/product/components/forms/product-form';

const page = ({ params }: { params: { id: string } }) => {
    return (
        <div>
            <ProductForm id={params.id} />
        </div>
    );
};

export default page;