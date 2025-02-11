import React from 'react';
import { FloorForm } from '../components/forms';
const page = ({ params }: { params: { id: string } }) => {
    return (
        <div>
            <FloorForm id={params.id} />
        </div>
    );
};

export default page;