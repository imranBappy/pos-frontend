import { PRODUCT_TYPE } from '@/graphql/product';
import { StateCreator, } from "zustand";

export interface CARD_TYPE {
    id: string,
    quantity: number,
    price: number,
    name: string,
    vat: number,
    discount: number,
    product?: PRODUCT_TYPE,
    itemId?: number
    totalDiscount: number
}
export interface CartState {
    cart: CARD_TYPE[],
    addCart: (item: CARD_TYPE) => void;
    addCarts: (items: CARD_TYPE[]) => void;
    removeCart: (id: string) => void;
    clearCart: () => void;
    incrementItemQuantity: (id: string) => void;
    decrementItemQuantity: (id: string) => void;

}

export const createCartSlice: StateCreator<CartState, [], [], CartState> = (set) => ({
    cart: [],
    addCart: (item) => set((state) => ({
        cart: [...state.cart, item]
    })),
    incrementItemQuantity: (id: string) => set((state) => ({
        cart: state.cart.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item)
    })),
    decrementItemQuantity: (id: string) => set((state) => {
        const newCart: CARD_TYPE[] = [];
        for (let i = 0; i < state.cart.length; i++) {
            const element: CARD_TYPE = state.cart[i];
            if (id === element.id && element.quantity < 2) {
                continue;
            } else if (id === element.id && element.quantity > 1) {
                newCart.push({
                    ...element,
                    quantity: element.quantity - 1
                })
            } else {
                newCart.push(element)
            }
        }
        return { cart: newCart }
    }),
    addCarts: (items: CARD_TYPE[]) => set({ cart: [...items] }),
    removeCart: (id) => set((state) => ({
        cart: state.cart.filter((item) => item.id !== id)
    })),
    clearCart: () => set({ cart: [] })
})



export default createCartSlice;