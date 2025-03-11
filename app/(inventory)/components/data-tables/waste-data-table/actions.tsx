import DeleteAlert from "@/components/delete-alert";
import { DELETE_WASTE } from "@/graphql/waste/mutations";
import { WASTES_QUERY } from "@/graphql/waste/queries";
import { WASTE_TYPE } from "@/graphql/waste/types";

interface ActionsDropdownProps {
    item: WASTE_TYPE;
}

const Actions = ({ item }: ActionsDropdownProps) =>{
    return (
        <div className="flex items-center justify-center space-x-2">
            <DeleteAlert
                query={DELETE_WASTE}
                id={item.id}
                refreshQuery={WASTES_QUERY}
                refreshVariables={{
                    offset: 0,
                    first: 10,
                }}
            />
        </div>
    );
};

export default Actions;