import type { ApiResponse } from "@/types/apiResponse";
import { axiosClient } from "./axiosClient";
import type { GetOrganizationTreeRequest, GetOrganizationTreeResponse } from "@/types/organization";

const fetchOrganizationTree = async (request?: GetOrganizationTreeRequest)
    : Promise<ApiResponse<GetOrganizationTreeResponse[]>> => {
    const response = await axiosClient.get(`Organizations`, {
        params: request
    })
    return response.data;
}

const organizationApi = {
    fetchOrganizationTree,
}

export default organizationApi;