import { OUTLET_TYPE } from "@/graphql/outlet/types";
import { StateCreator } from "zustand";


export interface OutletState {
    outlets: OUTLET_TYPE[],
    loadOutlet: (items: OUTLET_TYPE[]) => void;
    selectOutlet: (id: string) => void;
    clearOutlet: () => void;
}

export const createOutletSlice: StateCreator<OutletState, [], [], OutletState> = (set) => ({
    outlets: [],
    loadOutlet: (items) => set({ outlets: items }),
    selectOutlet: (id: string) => set((state) => {
        const newOutlet = [...state.outlets];
        const index = newOutlet.findIndex((item) => item.id === id)
        const tamp: OUTLET_TYPE = newOutlet[0];
        newOutlet[0] = newOutlet[index];
        newOutlet[index] = tamp;
        return { outlets: newOutlet }
    }),
    clearOutlet: () => set({ outlets: [] }),
}) 