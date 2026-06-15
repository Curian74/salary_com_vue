import type { GetGridConfigsRequest, GetGridConfigsResponse } from "@/types/gridConfig";
import { axiosClient } from "./axiosClient";
import type { ApiResponse } from "@/types/apiResponse";

const fetchGridConfigs = async (gridName: string, params?: GetGridConfigsRequest)
    : Promise<ApiResponse<GetGridConfigsResponse[]>> => {
    const response = await axiosClient.get(`/GridConfigs/${gridName}`, {
        params
    })
    return response.data;
}

const updateGridConfigs = async (gridName: string, ids: string[])
    : Promise<ApiResponse<void>> => {
    const response = await axiosClient.put(`/GridConfigs/${gridName}`, { ids });
    return response.data;
}

const gridConfigApi = {
    fetchGridConfigs,
    updateGridConfigs,
}

export default gridConfigApi;