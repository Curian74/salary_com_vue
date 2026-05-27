import type { AutoSumEmployeeType } from "@/enums/autoSumEmployeeType";
import type { CompositionType } from "@/enums/compositionType";
import type { DeductionType } from "@/enums/deductionType";
import type { IncomeTaxType } from "@/enums/incomeTaxType";
import type { SourceType } from "@/enums/sourceType";
import type { TrackingStatus } from "@/enums/trackingStatus";
import type { ValueType } from "@/enums/valueType";

export interface GetSalaryCompositionsResponse {
    id: string;
    code: string;
    name: string;
    description: string;
    systemCompositionId: string;
    compositionType: CompositionType;
    compositionNature: number;
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

export interface GetSalaryCompositionsRequest {

}