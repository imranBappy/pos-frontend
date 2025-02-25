'use client';
import { Separator } from '@/components/ui';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import SearchableFiled from '@/components/SearchableFiled';
import { CUSTOMER_SEARCH_QUERY } from '@/graphql/accounts/queries';
import { USER_TYPE } from '@/graphql/accounts';

const SearchEmployer = ({
    onSelect,
}: {
    onSelect: (user: USER_TYPE) => void;
}) => {
    const [search, setSearch] = useState('');
    const [value, setValue] = useState('');

    const { data, loading } = useQuery(CUSTOMER_SEARCH_QUERY, {
        variables: {
            search: search,
            first: 30,
        },
        fetchPolicy: 'network-only',
    });

    const suppliers: USER_TYPE[] = data?.users?.edges?.map(
        ({ node }: { node: USER_TYPE }) => node
    );

    const handleSelect = (user: USER_TYPE) => {
        setSearch('');
        setValue('');
        onSelect(user);
    };

    const resultsElements = suppliers?.map((user: USER_TYPE) => (
        <>
            <div
                onClick={() => handleSelect(user)}
                key={user.id}
                className="text-sm"
            >
                {`${user.name} - ${user.address}`}
            </div>
            <Separator className="my-2" />
        </>
    ));

    const elementContainer = (
        <div className="absolute shadow dark:bg-black top-10 bg-white">
            <ScrollArea className="h-72 w-80 z-50 rounded-md   border ">
                <div className="p-4">{resultsElements}</div>
            </ScrollArea>
        </div>
    );

    const notFound = (
        <p className="  text-center mt-5 text-sm">Not Found Result!</p>
    );
    let content = suppliers?.length ? elementContainer : notFound;

    if (loading)
        content = <p className="   text-center mt-5 text-sm">Loading...</p>;

    if (!search) {
        content = <></>;
    }
    return (
        <SearchableFiled
            onChange={(value: string) => setSearch(value)}
            valueState={[value, setValue]}
        >
            {content}
        </SearchableFiled>
    );
};

export default SearchEmployer;
