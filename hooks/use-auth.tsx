import { JWT_TOKEN_KEY, ROLE_KEY } from "@/constants/auth.constants";
import { ME_QUERY } from "@/graphql/accounts/queries";
import authVerify, { AuthError, DecodedToken } from "@/lib/auth";
import useStore from "@/stores";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react"


interface UserType {
    name: string,
    email: string,
    photo: string,
    role: string,
}

type authDataType = AuthError | DecodedToken
const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<UserType | null>(null)
    const authData: authDataType = authVerify()
    const router = useRouter()
    const _logout = useStore((store) => store.logout)


    const logout = () => {
        localStorage.removeItem(JWT_TOKEN_KEY)
        localStorage.removeItem(ROLE_KEY)
        setIsAuthenticated(false)
        setIsLoading(false)
        router.push("/login")
        _logout()
    }

    useQuery(ME_QUERY, {
        onCompleted(data) {
            const { email, name, role, photo } = data.me
            setUser({
                email: email,
                name: name,
                role: role,
                photo: photo
            })
        },
        onError() {
            logout()
        }
    })


    useEffect(() => {
        if ('error' in authData) {
            setIsAuthenticated(false)
        }
        if ('email' in authData && !('error' in authData)) {
            setIsAuthenticated(true)
        }
        setIsLoading(false)
    }, [authData])

    if (isAuthenticated) {
        return {
            isAuthenticated: isAuthenticated,
            isLoading: isLoading,
            user: user,
            logout: logout
        }
    }
    if (!isAuthenticated) {
        return {
            isAuthenticated: isAuthenticated,
            isLoading: isLoading,
            user: null,
            logout: logout
        }
    }

}

export default useAuth