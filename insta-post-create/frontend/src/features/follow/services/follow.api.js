import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// Get all users with isFollowing status
export async function getAllUsers() {
  try {
    const res = await api.get("/api/users");
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Get users that I follow
export async function getFollowing() {
  try {
    const res = await api.get("/api/users/following");
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Get users that follow me
export async function getFollowers() {
  try {
    const res = await api.get("/api/users/followers");
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Follow a user
export async function followUser(username) {
  try {
    const res = await api.post(`/api/users/follow/${username}`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Unfollow a user
export async function unfollowUser(username) {
  try {
    const res = await api.post(`/api/users/unfollow/${username}`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
