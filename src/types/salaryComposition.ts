import type {
    AutoSumEmployeeType,
    CompositionNature,
    CompositionType,
    DeductionType,
    IncomeTaxType,
    OptionShowPaycheck,
    SourceType,
    TrackingStatus,
    ValueType
} from "@/enums/salaryCompositionEnums";
import type { ApiRequest } from "./apiRequest";

export interface GetSalaryCompositionsResponse {
    id: string;
    code: string;
    name: string;
    description: string;
    systemCompositionId: string;
    compositionType: CompositionType;
    compositionNature: CompositionNature;
    incomeTaxType: IncomeTaxType;
    deductionType: DeductionType;
    quotaFormula: string | null;
    allowToExceedQuota: boolean;
    valueType: ValueType;
    isAutoSumEmployee: boolean;
    autoSumEmployeeType: AutoSumEmployeeType;
    organizationalStructureLevel: number | null;
    salaryCompositionId: string | null;
    valueFormula: string;
    optionShowPaycheck: OptionShowPaycheck;
    sourceType: SourceType;
    status: TrackingStatus;
    organizationUnitIds: string;
    organizationUnitNames: string;
}

export interface GetSalaryCompositionsRequest extends ApiRequest {
    searchTerm?: string
    trackingStatus?: TrackingStatus | null
    organizationIds?: string[] | null
}

export type SalaryCompositionFormMode = 'create' | 'edit' | 'view';

export interface CreateSalaryCompositionRequest {
    code: string;
    name: string;
    description?: string;

    systemCompositionId?: string;

    compositionType: CompositionType;
    compositionNature: CompositionNature;

    incomeTaxType?: IncomeTaxType;
    deductionType?: DeductionType;

    quotaFormula?: string;
    allowToExceedQuota?: boolean;

    valueType: ValueType;
    isAutoSumEmployee?: boolean;
    autoSumEmployeeType?: AutoSumEmployeeType;
    organizationalStructureLevel?: number;

    valueFormula?: string;
    optionShowPaycheck: OptionShowPaycheck;

    organizationUnitIds?: string[];
}

