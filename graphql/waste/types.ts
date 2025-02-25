import { USER_TYPE } from "../accounts";


export interface WASTE_TYPE {
    id: string;
    date: string;
    responsible?: USER_TYPE | null;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    estimatedCost: number;
}
