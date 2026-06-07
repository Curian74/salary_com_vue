import * as yup from 'yup';

export const salaryCompositionSchema = yup.object({
    code: yup.string().trim().required('Không được để trống.'),
    name: yup.string().trim().required('Không được để trống.'),
    description: yup.string().trim().optional(),
    systemCompositionId: yup.string().trim().optional(),

    compositionType: yup
        .number()
        .required('Không được để trống.'),

    compositionNature: yup
        .number()
        .required('Không được để trống.'),

    incomeTaxType: yup
        .number()
        .optional(),

    deductionType: yup
        .number()
        .optional(),

    quotaFormula: yup.string().trim().optional(),

    allowToExceedQuota: yup.boolean().optional(),

    valueType: yup
        .number()
        .required('Không được để trống.'),

    isAutoSumEmployee: yup.boolean().optional(),

    autoSumEmployeeType: yup
        .number()
        .optional(),

    organizationalStructureLevel: yup
        .number()
        .optional(),

    valueFormula: yup.string().trim().optional(),

    optionShowPaycheck: yup
        .number()
        .required('Không được để trống.'),

    organizationUnitIds: yup
        .array()
        .of(yup.string().required())
        .min(1, 'Không được để trống.')
        .required('Không được để trống.'),
});