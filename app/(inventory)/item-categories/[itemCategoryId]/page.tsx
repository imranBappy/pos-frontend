import React from 'react';
import ItemCategoryForm from '../../components/forms/item-category-form';

const page = ({ params }: { params: { itemCategoryId: string } }) => {
    return (
        <div>
            <ItemCategoryForm itemCategoryId={params.itemCategoryId} />
        </div>
    );
};

export default page;