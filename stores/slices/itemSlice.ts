import { StateCreator, } from "zustand";

export interface ItemState {
    items: Map<string, { quantity: number, price: number }>;
    addItem: (id: string, quantity: number, price: number,) => void;
    remoteItem: (id: string) => void;
    clearItems: () => void;
}

export const itemSlice: StateCreator<ItemState, [], [], ItemState> = (set) => ({
    items: new Map(),
    addItem: (id, quantity, price) => set((state) => {
        const updatedItems = new Map(state.items);
        updatedItems.set(id, { quantity: quantity, price: price });
        return { items: updatedItems };
    }),
    remoteItem: (id: string) => set((state) => {
        const updatedItems = new Map(state.items);
        updatedItems.delete(id);
        return { items: updatedItems };
    }),
    clearItems: () => set({ items: new Map(), }),
})



export default itemSlice;