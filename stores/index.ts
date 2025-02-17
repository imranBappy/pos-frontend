import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import {
    AuthState,
    createAuthSlice,
    itemSlice,
    ItemState,
    CartState,
    OutletState,
    TableState,
    createCartSlice,
    createOutletSlice,
    createTableSlice,
} from "@/stores/slices";

type AppState = TableState & CartState & OutletState & AuthState & ItemState;

const useStore = create<AppState>()(
    devtools(
        persist(
            (...a) => ({
                ...createCartSlice(...a),
                ...createTableSlice(...a),
                ...createOutletSlice(...a),
                ...createAuthSlice(...a),
                ...itemSlice(...a),
            }),
            {
                name: "bound-store", // Name of the localStorage key
                partialize: (state) => ({
                    // Store only what's necessary
                    cart: state.cart,
                    token: state.token,
                    isAuthenticated: state.isAuthenticated,
                    role: state.role,
                    outlets: state.outlets,
                    table: state.table,
                }),
            }
        )
    )
);

export default useStore;
