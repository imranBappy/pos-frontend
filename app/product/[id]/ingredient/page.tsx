import React from 'react';
import IngredientForm from '../../components/forms/ingredient-form';

const page = ({ params }: { params: { id: string } }) => {
    return (
        <div>
            <IngredientForm productId={params.id} />
        </div>
    );
};

export default page;