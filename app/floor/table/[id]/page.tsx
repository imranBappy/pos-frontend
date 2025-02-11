import React from 'react';
import { FloorTableForm } from '../../components/forms/floor-table-form';

const page = ({ params }: { params: { id: string } }) => {
    return (
        <div>
            <FloorTableForm id={params.id} />
        </div>
    );
};

export default page;