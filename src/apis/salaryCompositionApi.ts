import type { CreateSalaryCompositionRequest, DeleteRequest, GetSalaryCompositionsRequest, GetSalaryCompositionsResponse, SalaryCompositionDetail, UpdateSalaryCompositionRequest, UpdateStatusRequest } from "@/types/salaryComposition";
import { axiosClient } from "./axiosClient";
import type { ApiResponse, PagedResult } from "@/types/apiResponse";

const fetchSalaryCompositions = async (params?: GetSalaryCompositionsRequest)
    : Promise<ApiResponse<PagedResult<GetSalaryCompositionsResponse>>> => {
    const response = await axiosClient.get('/SalaryCompositions/paged', {
        params,
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

const deleteMany = async (data: DeleteRequest)
    : Promise<ApiResponse<void>> => {
    const response = await axiosClient.delete('SalaryCompositions/batch', {
        data
    });
    return response.data;
}

const getById = async (id: string)
    : Promise<ApiResponse<SalaryCompositionDetail>> => {
    const response = await axiosClient.get(`/SalaryCompositions/${id}`);
    return response.data;
}

const updateSalaryComposition = async (id: string, body: UpdateSalaryCompositionRequest)
    : Promise<ApiResponse<boolean>> => {
    const response = await axiosClient.put(`/SalaryCompositions/${id}`, body);
    return response.data;
}

const salaryCompositionApi = {
    fetchSalaryCompositions,
    createSalaryComposition,
    updateStatus,
    deleteMany,
    getById,
    updateSalaryComposition,
}

export default salaryCompositionApi;
