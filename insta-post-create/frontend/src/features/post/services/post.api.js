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


export async function createPost(imageFile , caption){
    const formData = new FormData()
    formData.append("image" , imageFile)
    formData.append("caption" , caption)

    try {
        const response = await api.post(`/api/posts` , formData)
        return response.data
    } catch (error) {
        console.log(error)
        return error
    }
}


export async function likePost(postId){
    try{
        const response = await api.post(`/api/posts/like/${postId}`)
        return response.data
    } catch (error){
        console.log(error)
        return error
    }
}

export async function unlikePost(postId){
    try{
        const response = await api.post(`/api/posts/unlike/${postId}`)
        return response.data
    } catch (error){
        console.log(error)
        return error
    }
}
