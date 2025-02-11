import React from 'react';
import ItemForm from '../../components/forms/item-form';

const page = ({ params }: { params: { itemId: string } }) => {
    return (
        <div>
            <ItemForm itemId={params.itemId} />
        </div>
    );
};

export default page;