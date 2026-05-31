import type { ApiResponse, LookupResponse } from "@/types/apiResponse";
import { axiosClient } from "./axiosClient";

const getTrackingStatuses = async ()
    : Promise<ApiResponse<LookupResponse[]>> => {
    const response = await axiosClient.get('/Lookups/tracking-status')
    return response.data;
}

const lookupApi = {
    getTrackingStatuses,
}

export default lookupApi;