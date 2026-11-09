import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || "http://10.0.2.2:5000";
const API = axios.create({ baseURL: `${BASE_URL}/api` });

export const getProducts = () => API.get("/products");
export const createSubscription = (data) => API.post("/subscriptions", data);
export const getMySubscriptions = () => API.get("/subscriptions/my");
export const getSubscriptions = () => API.get("/subscriptions");
export const getAdminStats = () => API.get("/admin/stats");
export const updateSubscription = (id, data) => API.put(`/subscriptions/${id}`, data);
export const skipSubscription = (id) => API.put(`/subscriptions/${id}/skip`);