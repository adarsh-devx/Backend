import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  withCredentials: true,
});

export const registerApi = async (username, email, password) => {
  try {
    const res = await api.post("/register", { username, email, password });
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const loginApi = async (username, password) => {
  try {
    const res = await api.post("/login", { username, password });

    return res.data;
  } catch (err) {
    throw err;
  }
};

export const getMeApi = async () => {
  try {
    const res = await api.get("/get-me");
    return res.data;
  } catch (err) {
    throw err;
  }
};
