import axios from "axios";
import { getToken } from "../utils/storage";

const api = axios.create({
    baseURL: "http://192.168.10.2:8000",
});

api.interceptors.request.use((config) => {
    const token = getToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;