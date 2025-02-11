import React from 'react';
import { CategoryForm } from '@/app/product/components/forms/category-form';

const page = ({ params }: { params: { id: string } }) => {
    return (
        <div>
            <CategoryForm id={params.id} />
        </div>
    );
};

export default page;