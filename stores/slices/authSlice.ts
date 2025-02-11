import { StateCreator, } from "zustand";


export interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    role: string | undefined,
    login: (token: string, role: string | undefined) => void;
    logout: () => void;
}


export const createAuthSlice: StateCreator<AuthState, [], [], AuthState> = (set) => ({
    token: null,
    isAuthenticated: false,
    role: undefined,
    login: (token: string, role: string | undefined) =>
        set(() => ({
            token,
            isAuthenticated: true,
            role: role
        })),
    logout: () => {
        set(() => ({ token: null, isAuthenticated: false }));
        sessionStorage.clear();
        localStorage.clear();
    },
})



export default createAuthSlice;