import React from 'react';
import UnitForm from '../../components/forms/unit-form';

const page = ({ params }: { params: { unitId: string } }) => {
    return (
        <div>
            <UnitForm unitId={params.unitId} />
        </div>
    );
};

export default page;