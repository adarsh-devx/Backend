import axios from "axios";


const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});


export async function register({email , username , password}){
    try {
        const response = await api.post("/api/auth/register", {email , username , password});
        return response.data;
    } catch (error) {
        console.error("Error registering:", error);
        throw error;
    }
}

export async function login({email , password}){
    try {
        const response = await api.post("/api/auth/login", {email , password});
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
}


export async function getMe(){
    try {
        const response = await api.get("/api/auth/get-me");
        return response.data;
    } catch (error) {
        console.error("Error getting user:", error);
        throw error;
    }
}