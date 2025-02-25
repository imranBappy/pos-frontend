import { StateCreator, } from "zustand";
/*
    kay:id of item,
*/
export type ITEMS_TYPE = Map<
  string,
  { quantity: number; price: number; id?: string; name?: string; vat: number }
>;
export interface ItemState {
  items: ITEMS_TYPE;
  addItem: (
    id: string,
    quantity: number,
    price: number,
    item?: string,
    name?: string,
    vat?:number,
  ) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
  addItems: (items: ITEMS_TYPE) => void;
}

export const itemSlice: StateCreator<ItemState, [], [], ItemState> = (set) => ({
  items: new Map(),
  addItem: (id, quantity, price, item = undefined, name, vat) =>
    set((state) => {
      const updatedItems = new Map(state.items);
      updatedItems.set(id, {
        id: item,
        quantity: quantity,
        price: price,
        name: name,
        vat:vat ||0
      });
      return { items: updatedItems };
    }),
  addItems: (items) => set({ items: items }),
  removeItem: (id: string) =>
    set((state) => {
      const updatedItems = new Map(state.items);
      updatedItems.delete(id);
      return { items: updatedItems };
    }),
  clearItems: () => set({ items: new Map() }),
});



export default itemSlice;