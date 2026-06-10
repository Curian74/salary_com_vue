import type { ApiErrorResponse } from "@/types/apiResponse";
import axios from "axios";

export const getApiErrorMessage = (
    err: unknown,
    defaultMessage: string = 'Có lỗi xảy ra, vui lòng thử lại!'
): string => {
    // Kiểm tra nếu là lỗi của Axios
    if (axios.isAxiosError<ApiErrorResponse>(err)) {
        return err.response?.data?.error?.message || defaultMessage;
    }

    // Trường hợp khác
    return defaultMessage;
};