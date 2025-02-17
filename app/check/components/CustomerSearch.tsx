"use client"
import { Separator } from '@/components/ui';
import React, { useState } from 'react';
import SearchableFiled from '@/components/SearchableFiled';
import { useQuery } from '@apollo/client';
import { CUSTOMER_SEARCH_QUERY } from '@/graphql/accounts/queries';
import { ScrollArea } from '@/components/ui/scroll-area';

interface UserType {
    id: string,
    name: string,
    email: string
    phone: string
}

const CustomerSearch = () => {
    const [search, setSearch] = useState("")
    const [value, setValue] = useState("")
    const [customer, setCustomer] = useState<UserType>()

    const { data, loading } = useQuery(CUSTOMER_SEARCH_QUERY, {
        variables: {
            search: search,
            first: 30
        },
        fetchPolicy: 'network-only',
    })

    const users: UserType[] = data?.users?.edges?.map(({ node }: { node: UserType }) => node)

    const handleSelect = (user: UserType) => {
        setCustomer(user)
        setSearch("")
        setValue("")
    }




    const resultsElements = users?.map((user: UserType) => (
        <>
            <div
                onClick={() => handleSelect(user)}
                key={user.id} className="text-sm">
                {`${user.name} - ${user.email}`}
            </div>
            <Separator className="my-2" />
        </>
    ))

    const elementContainer = <div className="absolute shadow dark:bg-black top-10 bg-white">
        <ScrollArea className="h-72 w-80 z-50 rounded-md   border ">
            <div className="p-4">
                <h4 className="mb-4 text-sm font-medium leading-none">Search result</h4>
                {resultsElements}
            </div>
        </ScrollArea>
    </div>

    const notFound = <p className="  text-center mt-5 text-sm">Not Found Result!</p>
    let content = users?.length ? elementContainer : notFound

    if (loading) content = <p className="   text-center mt-5 text-sm">Loading...</p>

    if (!search) {
        content = <></>
    }
    return (
        <div>
            <p>User : {customer?.name}</p>
            <SearchableFiled
                onChange={(value: string) => setSearch(value)}
                valueState={[value, setValue]}
            >
                {content}
            </SearchableFiled>
        </div>
    );
};

export default CustomerSearch;