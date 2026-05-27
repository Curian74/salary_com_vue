import type { GetSalaryCompositionsRequest, GetSalaryCompositionsResponse } from "@/types/salaryComposition";
import { axiosClient } from "./axiosClient";
import type { ApiResponse, PagedResult } from "@/types/apiResponse";

const fetchSalaryCompositions = async (params?: GetSalaryCompositionsRequest)
    : Promise<ApiResponse<PagedResult<GetSalaryCompositionsResponse>>> => {
    const response = await axiosClient.get('/SalaryCompositions/paged', {
        params
    })
    return response.data;
}

const salaryCompositionApi = {
    fetchSalaryCompositions,
}

export default salaryCompositionApi;