import axios from 'axios'

// Use relative base so Vite dev proxy forwards /api and /sanctum to Laravel.
// In production, set VITE_BACKEND_URL to the full backend URL.
const baseURL = import.meta.env.VITE_BACKEND_URL || ''

export const axiosClient = axios.create({
    baseURL,
    withCredentials : true,
    withXSRFToken: true,
})

