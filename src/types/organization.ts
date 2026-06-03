import type { TrackingStatus } from "@/enums/salaryCompositionEnums";

export interface GetOrganizationTreeResponse {
    id: string;
    name: string;
    parentId: string;
    trackingStatus: TrackingStatus;
    hasChildren: boolean;
}

export interface GetOrganizationTreeRequest {
    trackingStatus: TrackingStatus
}