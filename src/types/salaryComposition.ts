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

export interface SalaryCompositionDetail {
    id: string;
    code: string;
    name: string;
    description?: string;
    systemCompositionId: string | null;
    compositionType: CompositionType;
    compositionNature: CompositionNature;
    incomeTaxType: IncomeTaxType;
    deductionType?: DeductionType;
    quotaFormula: string | null;
    allowToExceedQuota: boolean;
    valueType: ValueType;
    isAutoSumEmployee: boolean;
    autoSumEmployeeType: AutoSumEmployeeType;
    organizationalStructureLevel?: number;
    salaryCompositionId: string | null;
    valueFormula: string | null;
    optionShowPaycheck: OptionShowPaycheck;
    sourceType: SourceType;
    status: TrackingStatus;
    organizations?: SalaryCompositionOrganization[];
    // organizationUnitIds?: string;
    // organizationUnitNames?: string;
    isTaxDeduction: boolean,
}

export interface SalaryCompositionOrganization {
    orgId: string;
    orgName: string;
}

export interface GetSalaryCompositionsResponse {
    id: string;
    code: string;
    name: string;
    description: string | null;
    systemCompositionId: string | null;
    compositionType: CompositionType;
    compositionNature: CompositionNature;
    incomeTaxType: IncomeTaxType;
    deductionType: DeductionType | null;
    quotaFormula: string | null;
    allowToExceedQuota: boolean;
    valueType: ValueType;
    isAutoSumEmployee: boolean;
    autoSumEmployeeType: AutoSumEmployeeType;
    organizationalStructureLevel: number | null;
    salaryCompositionId: string | null;
    valueFormula: string | null;
    optionShowPaycheck: OptionShowPaycheck;
    sourceType: SourceType;
    status: TrackingStatus;
    organizations?: SalaryCompositionOrganization[];
    organizationUnitIds?: string;
    organizationUnitNames?: string;
    isTaxDeduction: boolean,
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
    salaryCompositionId?: string | null;

    valueFormula?: string;
    optionShowPaycheck: OptionShowPaycheck;

    organizationUnitIds?: string[];
}

export interface UpdateStatusRequest {
    salaryCompositionIds: string[],
    status: TrackingStatus,
}

export interface DeleteRequest {
    salaryCompositionIds: string[],
}

export interface UpdateSalaryCompositionRequest {
    name: string;
    description?: string;
    systemCompositionId?: string;

    incomeTaxType?: IncomeTaxType;
    deductionType?: DeductionType;

    quotaFormula?: string;
    allowToExceedQuota?: boolean;

    isAutoSumEmployee?: boolean;
    autoSumEmployeeType?: AutoSumEmployeeType;
    organizationalStructureLevel?: number;
    valueFormula?: string;
    salaryCompositionId?: string | null;
    optionShowPaycheck: OptionShowPaycheck;

    organizationUnitIds?: string[];
}