// import jwtDecode from 'jwt-decode'
import { JWT_TOKEN_KEY, ROLE_KEY } from '@/constants/auth.constants';
import { jwtDecode } from "jwt-decode";


export interface AuthError {
    error: true;
    message: string;
}

export interface DecodedToken {
    email: string;
    exp: number;
    role: string;
    origIat: number
}

export type AuthVerifyResult = DecodedToken | AuthError;

const authVerify = (): AuthVerifyResult => {
    try {
        const token = localStorage.getItem(JWT_TOKEN_KEY)
        const role = localStorage.getItem(ROLE_KEY) || ''
        if (!token) return {
            error: true,
            message: 'User is unauthorized!'
        }
        const decode: DecodedToken = jwtDecode(token)
        const tokenExpiration = decode.exp || 0;
        if (Date.now() >= tokenExpiration * 1000) {
            localStorage.removeItem(JWT_TOKEN_KEY);
            localStorage.removeItem(ROLE_KEY);
            return {
                error: true,
                message: 'Your token is expired.'
            }
        }

        return {
            ...decode,
            role: role
        }
    } catch {
        return {
            error: true,
            message: 'User is unauthorized!'
        }
    }
}


export default authVerify;
