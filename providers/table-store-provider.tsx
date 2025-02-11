// src/providers/counter-store-provider.tsx
'use client';

import { ReactNode, createContext, useRef, useContext } from 'react';
import { useStore } from 'zustand';

import {
    type CounterStore as TableStore,
    createCounterStore,
    defaultInitState,
} from '@/stores/table-store';

export type CounterStoreApi = ReturnType<typeof createCounterStore>;

export const TableStoreContext = createContext<CounterStoreApi | undefined>(
    undefined,
);

export interface TableStoreProviderProps {
    children: ReactNode;
}

export const CounterStoreProvider = ({ children }: TableStoreProviderProps) => {
    // Ensure the store is only created once using useRef
    const storeRef = useRef<CounterStoreApi | null>(null);
    if (!storeRef.current) {
        storeRef.current = createCounterStore(defaultInitState); // Use defaultInitState for clarity
    }

    return (
        <TableStoreContext.Provider value={storeRef.current}>
            {children}
        </TableStoreContext.Provider>
    );
};

export const useTableStore = <T,>(selector: (store: TableStore) => T): T => {
    const tableStoreContext = useContext(TableStoreContext);
    if (!tableStoreContext) {
        throw new Error('useTableStore must be used within CounterStoreProvider');
    }
    return useStore(tableStoreContext, selector);
};
