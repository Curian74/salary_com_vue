export interface ApiResponse<T> {
    isSuccess: boolean;
    error: ErrorDetail;
    isFailure: boolean;
    value: T;
}

export interface PagedResult<T> {
    items: T[];
    totalCount: number;
    pageSize: number;
    pageIndex: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
};

export interface ErrorDetail {
    code: string;
    description: string;
    details: string[];
}

export interface Pagination<T> {
    items: T[]
    total: number
    page: number
    pageSize: number
}

export interface LookupResponse {
    value: number;
    name: string;
}