import WasteCategoryForm from '@/app/(inventory)/components/forms/waste-category-form';
import React from 'react';
 

const page = ({ params }: { params: { wasteCategoryId: string } }) => {
    return (
        <div>
            <WasteCategoryForm wasteCategoryId={params.wasteCategoryId} />
        </div>
    );
};

export default page;