import { setError, setUser } from "../state/auth.slice.js"
import { register,login } from "../service/auth.api.js"
import { useDispatch } from "react-redux"


export const useAuth = () => {
    const dispatch = useDispatch()

    async function handleRegister({ email, contact, password, fullName, isSeller = false }) {
        try {
            const data = await register({ email, contact, password, fullName, isSeller })
            dispatch(setUser(data.user))
        } catch (error) {
            dispatch(setError(error.message))
            throw error  // re-throw so form can show local error state
        }
    }

    async function handleLogin({ email, password }) {
        try {
            const data = await login({ email, password })
            dispatch(setUser(data.user))
        } catch (error) {
            dispatch(setError(error.message))
            throw error
        }
    }

    return { handleRegister, handleLogin }
}
