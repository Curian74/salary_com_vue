import type {
    AutoSumEmployeeType,
    CompositionNature,
    CompositionType,
    DeductionType,
    IncomeTaxType,
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
    optionShowPaycheck: number;
    sourceType: SourceType;
    status: TrackingStatus;
    organizationUnitIds: string;
    organizationUnitNames: string;
}

export interface GetSalaryCompositionsRequest extends ApiRequest {

}
