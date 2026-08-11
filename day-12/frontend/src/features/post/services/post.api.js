import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
})


export const getFeed = async () => {
    try {
        const response = await api.get(`/api/posts/feed`)
        return response.data
    } catch (error) {
        console.log(error)
        return error
    }
}