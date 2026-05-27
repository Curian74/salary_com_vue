export interface GridConfig {
    fieldKey: string;
    columnName: string;
    displayOrder?: number;
    isPinned?: boolean;
    isDisplayed?: boolean;
}

export interface GetGridConfigsResponse {
    fieldKey: string;
    columnName: string;
    displayOrder?: number;
    isPinned?: boolean;
    isDisplayed?: boolean;
}

export interface GetGridConfigsRequest {
    columnName?: string
}