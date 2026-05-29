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

const gridConfigApi = {
    fetchGridConfigs,
}

export default gridConfigApi;