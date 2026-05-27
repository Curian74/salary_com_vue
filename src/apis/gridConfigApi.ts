import type { GetGridConfigsRequest, GetGridConfigsResponse } from "@/types/gridConfig";
import { axiosClient } from "./axiosClient";
import type { ApiResponse, PagedResult } from "@/types/apiResponse";

const fetchGridConfigs = async (params?: GetGridConfigsRequest)
    : Promise<ApiResponse<GetGridConfigsResponse[]>> => {
    const response = await axiosClient.get('/GridConfigs', {
        params
    })
    return response.data;
}

const gridConfigApi = {
    fetchGridConfigs,
}

export default gridConfigApi;