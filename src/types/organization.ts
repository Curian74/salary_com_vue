import type { TrackingStatus } from "@/enums/salaryCompositionEnums";

export interface GetOrganizationTreeResponse {
    id: string;
    name: string;
    parentId: string;
    trackingStatus: TrackingStatus;
    hasChildren: boolean;
    children?: GetOrganizationTreeResponse[];
}

export interface GetOrganizationTreeRequest {
    trackingStatus?: TrackingStatus
}