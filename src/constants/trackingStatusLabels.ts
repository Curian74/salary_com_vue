import { TrackingStatus } from "@/enums/salaryCompositionEnums";

export const trackingStatusLabels: Record<number, string> = {
    [TrackingStatus.Active]: 'Đang theo dõi',
    [TrackingStatus.Inactive]: 'Ngừng theo dõi',
};