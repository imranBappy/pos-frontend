import { FLOOR_TABLES_TYPE } from '@/graphql/product';
import { StateCreator, } from "zustand";


export interface TableState {
    table: FLOOR_TABLES_TYPE[],
    addTable: (item: FLOOR_TABLES_TYPE) => void;
    removeTable: (id: string) => void;
    clearTable: () => void;
}
export const createTableSlice: StateCreator<TableState, [], [], TableState> = (set) => ({
    table: [],
    addTable: (item) => set((state) => ({
        table: [...state.table, item]
    })),
    removeTable: (id) => set((state) => ({
        table: state.table.filter((item) => item.id !== id)
    })),
    clearTable: () => set({ table: [] })
})

export default createTableSlice;