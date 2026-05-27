import axios from "axios";

const baseUrl = 'https://localhost:7272/api';

export const axiosClient = axios.create({
    baseURL: baseUrl,
});

