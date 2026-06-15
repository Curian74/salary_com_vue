import regex from '@/constants/regex/regex';
import { CompositionNature, CompositionType } from '@/enums/salaryCompositionEnums';
import * as yup from 'yup';

// Lấy ra values của các enum
// Vì enum ánh xạ cả key lẫn value, ex: [a,b,c, 1,2,3]
// nên chỉ filter lấy ra type bằng number
const validCompositionNatures = Object
    .values(CompositionNature)
    .filter((x): x is CompositionNature => typeof x === 'number');

export const salaryCompositionSchema = yup.object({
    name: yup
        .string()
        .trim()
        .required('Không được để trống.')
        .max(255, 'Không vượt quá 255 kí tự'),
    code: yup
        .string()
        .trim()
        .required('Không được để trống.')
        .max(255, 'Không vượt quá 255 kí tự')
        .matches(regex.ONLY_NUMBER, 'Không được chỉ nhập mỗi số.'), // Báo lỗi nếu chỉ có số

    description: yup.string().trim().optional(),
    systemCompositionId: yup.string().trim().optional(),

    compositionType: yup
        .number()
        .required('Không được để trống.'),

    compositionNature: yup
        .mixed<CompositionNature>()
        .oneOf(validCompositionNatures, 'Invalid')
        .required('')
    ,

    incomeTaxType: yup
        .number()
        .optional()
        .nullable(),

    deductionType: yup
        .number()
        .optional()
        .nullable(),

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
        .optional()
        .nullable(),

    salaryCompositionId: yup
        .string()
        .nullable()
        .when('isAutoSumEmployee', {
            is: true,
            then: (schema) => schema.required('Không được để trống.'),
            otherwise: (schema) => schema.optional(),
        }),

    valueFormula: yup.string().trim().optional().nullable(),

    optionShowPaycheck: yup
        .number()
        .required('Không được để trống.'),

    organizationUnitIds: yup
        .array()
        .of(yup.string().required())
        .min(1, 'Không được để trống.')
        .required('Không được để trống.'),
});
