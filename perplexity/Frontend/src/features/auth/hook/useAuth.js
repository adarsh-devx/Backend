import { useDispatch } from "react-redux";
import { register ,login ,getMe} from "../services/auth.api";
import { setUser, setError, setLoading } from "../auth.slice";


export function useAuth(){
    const dispatch = useDispatch();


    async function handleRegister({email , username , password}){
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const res = await register({email , username , password});
            return res;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Registration failed"));
        } finally{
            dispatch(setLoading(false));
        }
    }


    async function handleLogin({email , password}){
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const res = await login({email , password});
            dispatch(setUser(res.user));
            return res;
            
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Login failed"));
        } finally{
            dispatch(setLoading(false));
        }
    }

    async function handleGetMe(){
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const res = await getMe();
            dispatch(setUser(res.user));
            return res.user;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to fetch user"));
        } finally{
            dispatch(setLoading(false));
        }
    }


    return{
        handleRegister,
        handleLogin,
        handleGetMe,
        dispatch,  
    }
}