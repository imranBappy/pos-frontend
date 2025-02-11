import { USER_TYPE } from "../accounts";


export interface OUTLET_TYPE {
    name: string;
    id: string;
    address: string;
    phone: string;
    email: string;
    manager: USER_TYPE
    users?: {
        totalCount: number
    }
    orders?: {
        totalCount: number
    }
}