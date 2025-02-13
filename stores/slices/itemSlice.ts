import { StateCreator, } from "zustand";
export type ITEMS_TYPE = Map<string, { quantity: number, price: number, id?: string }>
export interface ItemState {
    items: ITEMS_TYPE;
    addItem: (id: string, quantity: number, price: number, item?: string,) => void;
    remoteItem: (id: string) => void;
    clearItems: () => void;
    addItems: (items: ITEMS_TYPE) => void
}

export const itemSlice: StateCreator<ItemState, [], [], ItemState> = (set) => ({
    items: new Map(),
    addItem: (id, quantity, price, item = undefined) => set((state) => {
        const updatedItems = new Map(state.items);
        updatedItems.set(id, { id: item, quantity: quantity, price: price });
        return { items: updatedItems };
    }),
    addItems: (items) => set({ items: items }),
    remoteItem: (id: string) => set((state) => {
        const updatedItems = new Map(state.items);
        updatedItems.delete(id);
        return { items: updatedItems };
    }),
    clearItems: () => set({ items: new Map(), }),
})



export default itemSlice;