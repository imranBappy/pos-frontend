import Link from "next/link";
import { SUPPLIER_TYPE } from "@/graphql/supplier/types";
import { DELETE_SUPPLIER_MUTATION } from "@/graphql/supplier/mutations";
import { SUPPLIERS_QUERY } from "@/graphql/supplier/queries";
import DeleteAlert from "@/components/delete-alert";
import { Button } from "@/components/ui/button";

interface ActionsDropdownProps {
    item: SUPPLIER_TYPE;
}

const Actions = ({ item }: ActionsDropdownProps) =>{
    return (
        <div className="flex items-center justify-center space-x-2">
            <DeleteAlert
                query={DELETE_SUPPLIER_MUTATION}
                id={item.id}
                refreshQuery={SUPPLIERS_QUERY}
                refreshVariables={{
                    offset: 0,
                    first: 10,
                }}
            />
            <Button variant="ghost" className="p-0 h-5">
                <Link href={`/suppliers/${item.id}`}>Edit</Link>
            </Button>
        </div>
    );
};

export default Actions;