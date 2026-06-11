import type { CreateSalaryCompositionRequest, GetSalaryCompositionsRequest, GetSalaryCompositionsResponse, UpdateStatusRequest } from "@/types/salaryComposition";
import { axiosClient } from "./axiosClient";
import type { ApiResponse, PagedResult } from "@/types/apiResponse";

const fetchSalaryCompositions = async (params?: GetSalaryCompositionsRequest)
    : Promise<ApiResponse<PagedResult<GetSalaryCompositionsResponse>>> => {
    const response = await axiosClient.get('/SalaryCompositions/paged', {
        params,
        paramsSerializer: {
            indexes: null,
        },
    })
    return response.data;
}

const createSalaryComposition = async (body: CreateSalaryCompositionRequest)
    : Promise<ApiResponse<void>> => {
    const response = await axiosClient.post('SalaryCompositions', body);
    return response.data;
}

const updateStatus = async (body: UpdateStatusRequest)
    : Promise<ApiResponse<void>> => {
    const response = await axiosClient.put('SalaryCompositions/status-batch', body);
    return response.data;
}


const salaryCompositionApi = {
    fetchSalaryCompositions,
    createSalaryComposition,
    updateStatus
}

export default salaryCompositionApi;
