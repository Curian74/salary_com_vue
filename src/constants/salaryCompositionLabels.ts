import {
    AutoSumEmployeeType,
    CompositionNature,
    CompositionType,
    DeductionType,
    IncomeTaxType,
    SourceType,
    TrackingStatus,
    ValueType
} from '@/enums/salaryCompositionEnums'

export const autoSumEmployeeTypeText: Record<AutoSumEmployeeType, string> = {
    [AutoSumEmployeeType.SameWorkingUnit]: 'Cùng đơn vị công tác',
    [AutoSumEmployeeType.UnderAuthority]: 'Cấp dưới',
}

export const compositionNatureText: Record<CompositionNature, string> = {
    [CompositionNature.Income]: 'Thu nhập',
    [CompositionNature.Deduction]: 'Khấu trừ',
    [CompositionNature.Other]: 'Khác',
}

export const compositionTypeText: Record<CompositionType, string> = {
    [CompositionType.EmployeeInfo]: 'Thông tin nhân viên',
    [CompositionType.Timekeeping]: 'Chấm công',
    [CompositionType.Revenue]: 'Doanh số',
    [CompositionType.KPI]: 'KPI',
    [CompositionType.Product]: 'Sản phẩm',
    [CompositionType.Salary]: 'Lương',
    [CompositionType.PersonalIncomeTax]: 'Thuế TNCN',
    [CompositionType.InsuranceUnion]: 'Bảo hiểm - Công đoàn',
    [CompositionType.Other]: 'Khác',
}

export const deductionTypeText: Record<DeductionType, string> = {
    [DeductionType.TaxDeduction]: 'Khấu trừ thuế',
}

export const incomeTaxTypeText: Record<IncomeTaxType, string> = {
    [IncomeTaxType.Taxable]: 'Chịu thuế',
    [IncomeTaxType.TaxFree]: 'Không chịu thuế',
    [IncomeTaxType.PartialTaxFree]: 'Miễn thuế một phần',
}

export const sourceTypeText: Record<SourceType, string> = {
    [SourceType.UserAdded]: 'Tự thêm',
    [SourceType.System]: 'Mặc định',
}

export const trackingStatusText: Record<TrackingStatus, string> = {
    [TrackingStatus.Active]: 'Đang theo dõi',
    [TrackingStatus.Inactive]: 'Ngừng theo dõi',
}

export const valueTypeText: Record<ValueType, string> = {
    [ValueType.Number]: 'Số',
    [ValueType.Currency]: 'Tiền tệ',
    [ValueType.Percentage]: 'Phần trăm',
    [ValueType.Text]: 'Chữ',
    [ValueType.Date]: 'Ngày',
}
