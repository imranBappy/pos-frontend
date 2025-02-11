import { FLOOR_TABLES_TYPE } from '../graphql/product/types';
import { createStore } from 'zustand/vanilla';

export type TableAction = {
  addTable: (newTable: FLOOR_TABLES_TYPE[]) => void;
};

export type CounterStore = {
  table: FLOOR_TABLES_TYPE[];
} & TableAction;

export const defaultInitState: Omit<CounterStore, 'addTable'> = {
  table: [],
};

export const createCounterStore = (initState = defaultInitState) => {
  return createStore<CounterStore>((set) => ({
    ...initState,
    addTable: (newTable: FLOOR_TABLES_TYPE[]) =>
      set((state) => ({
        ...state,
        table: newTable,
      })),
  }));
};
