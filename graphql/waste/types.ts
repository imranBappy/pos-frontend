import { USER_TYPE } from "../accounts";


export interface WASTE_TYPE {
    id: string;
    date: string;
    responsible?: USER_TYPE | null;
    note?: string;
    createdAt: string;
    updatedAt: string;
    totalLossAmount: number
}
