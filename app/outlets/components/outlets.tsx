"use client"
import { OUTLETS_QUERY } from '@/graphql/outlet/queries';
import { OUTLET_TYPE } from '@/graphql/outlet/types';
import { useQuery } from '@apollo/client';
import Outlet from './outlet';
import { Loading } from '@/components/ui';
const Outlets = () => {
    const { data, loading } = useQuery(OUTLETS_QUERY)
    if (loading) {
        return <Loading />

    }
    return (
        <div className='flex flex-wrap gap-4'>
            {
                data?.outlets?.edges?.map((item: { node: OUTLET_TYPE }) => <Outlet key={item.node.id} outlet={item.node} />)
            }

        </div>
    );
};

export default Outlets;