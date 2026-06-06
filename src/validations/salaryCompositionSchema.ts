import { toTypedSchema } from '@vee-validate/yup';
import * as yup from 'yup';
import {
    AutoSumEmployeeType,
    CompositionNature,
    CompositionType,
    DeductionType,
    IncomeTaxType,
    OptionShowPaycheck,
    ValueType,
} from '@/enums/salaryCompositionEnums';
import type {
    CreateSalaryCompositionRequest,
    SalaryCompositionFormModel,
} from '@/types/salaryComposition';

const numericEnumValues = <T extends Record<string, string | number>>(source: T) =>
    Object.values(source).filter((value): value is T[keyof T] & number => typeof value === 'number');

const optionalTrimmedString = () =>
    yup
        .string()
        .transform((value) => {
            if (typeof value !== 'string') {
                return value;
            }

            const trimmedValue = value.trim();

            return trimmedValue === '' ? undefined : trimmedValue;
        })
        .optional();

const optionalNumber = () =>
    yup
        .number()
        .transform((value, originalValue) => (originalValue === '' || originalValue === null ? undefined : value))
        .optional();

export const createSalaryCompositionSchema = yup.object({
    code: yup.string().trim().required('Ma thanh phan khong duoc de trong'),
    name: yup.string().trim().required('Ten thanh phan khong duoc de trong'),
    description: optionalTrimmedString(),
    systemCompositionId: optionalTrimmedString(),
    compositionType: yup
        .mixed<CompositionType>()
        .oneOf(numericEnumValues(CompositionType), 'Loai thanh phan khong hop le')
        .required('Loai thanh phan khong duoc de trong'),
    compositionNature: yup
        .mixed<CompositionNature>()
        .oneOf(numericEnumValues(CompositionNature), 'Tinh chat khong hop le')
        .required('Tinh chat khong duoc de trong'),
    incomeTaxType: yup
        .mixed<IncomeTaxType>()
        .oneOf(numericEnumValues(IncomeTaxType), 'Loai thue TNCN khong hop le')
        .optional(),
    deductionType: yup
        .mixed<DeductionType>()
        .oneOf(numericEnumValues(DeductionType), 'Loai khau tru khong hop le')
        .optional(),
    quotaFormula: optionalTrimmedString(),
    allowToExceedQuota: yup.boolean().optional(),
    valueType: yup
        .mixed<ValueType>()
        .oneOf(numericEnumValues(ValueType), 'Kieu gia tri khong hop le')
        .required('Kieu gia tri khong duoc de trong'),
    isAutoSumEmployee: yup.boolean().optional(),
    autoSumEmployeeType: yup
        .mixed<AutoSumEmployeeType>()
        .oneOf(numericEnumValues(AutoSumEmployeeType), 'Pham vi tu dong cong tong khong hop le')
        .optional(),
    organizationalStructureLevel: optionalNumber(),
    valueFormula: optionalTrimmedString(),
    optionShowPaycheck: yup
        .mixed<OptionShowPaycheck>()
        .oneOf(numericEnumValues(OptionShowPaycheck), 'Tuy chon hien thi tren phieu luong khong hop le')
        .required('Tuy chon hien thi tren phieu luong khong duoc de trong'),
    organizationUnitIds: yup.array().of(yup.string().required()).optional(),
});

export const createSalaryCompositionTypedSchema = toTypedSchema(createSalaryCompositionSchema);

const toOptionalString = (value: string) => {
    const trimmedValue = value.trim();

    return trimmedValue === '' ? undefined : trimmedValue;
};

const toOptionalArray = (value: string[]) => (value.length > 0 ? value : undefined);

export function toCreateSalaryCompositionRequest(
    formData: SalaryCompositionFormModel
): CreateSalaryCompositionRequest {
    const request: CreateSalaryCompositionRequest = {
        code: formData.code.trim(),
        name: formData.name.trim(),
        compositionType: formData.compositionType as CompositionType,
        compositionNature: formData.compositionNature,
        incomeTaxType: formData.incomeTaxType,
        allowToExceedQuota: formData.allowToExceedQuota,
        valueType: formData.valueType,
        isAutoSumEmployee: formData.isAutoSumEmployee,
        autoSumEmployeeType: formData.autoSumEmployeeType,
        optionShowPaycheck: formData.optionShowPaycheck,
    };

    const description = toOptionalString(formData.description);
    const quotaFormula = toOptionalString(formData.quotaFormula);
    const valueFormula = toOptionalString(formData.valueFormula);
    const organizationUnitIds = toOptionalArray(formData.organizationIds);

    if (description !== undefined) {
        request.description = description;
    }

    if (quotaFormula !== undefined) {
        request.quotaFormula = quotaFormula;
    }

    if (valueFormula !== undefined) {
        request.valueFormula = valueFormula;
    }

    if (organizationUnitIds !== undefined) {
        request.organizationUnitIds = organizationUnitIds;
    }

    return request;
}
