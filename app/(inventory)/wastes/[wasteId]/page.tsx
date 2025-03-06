import React from 'react';
import WasteDetails from '../../components/waste-details';

const page = ({ params }: { params: { wasteId: string } }) => {
    return (
        <div>
            <WasteDetails wasteId={params.wasteId} />
        </div>
    );
};

export default page;