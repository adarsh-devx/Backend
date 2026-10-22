import {setError, setLoding, setUser} from "../state/auth.slice.js"
import {register} from "../service/auth.api.js"
import {useDispatch} from "react-redux"


export const useAuth = ()=>{
    const dispatch = useDispatch()
    async function handleRegister({email ,contact , password , fullName , isSeller = false}){
        const data = await register({email ,contact , password , fullName , isSeller})
        try {
            dispatch(setUser(data.user))
            console.log(data.user)
        } catch (error) {
            dispatch(setError(error.message))
        }
    }
    return {handleRegister}
}


