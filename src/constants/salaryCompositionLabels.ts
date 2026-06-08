import {
    AutoSumEmployeeType,
    CompositionNature,
    CompositionType,
    DeductionType,
    IncomeTaxType,
    OptionShowPaycheck,
    SourceType,
    TrackingStatus,
    ValueType
} from '@/enums/salaryCompositionEnums'

export const autoSumEmployeeTypeText: Record<AutoSumEmployeeType, string> = {
    [AutoSumEmployeeType.SameWorkingUnit]: 'Trong cùng đơn vị công tác',
    [AutoSumEmployeeType.UnderAuthority]: 'Dưới quyền',
    [AutoSumEmployeeType.OrganizationStructure]: 'Thuộc cơ cấu tổ chức',
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
    [DeductionType.TaxDeduction]: 'Giảm trừ khi tính thuế',
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

export const optionShowPaycheckText: Record<OptionShowPaycheck, string> = {
    [OptionShowPaycheck.Yes]: 'Có',
    [OptionShowPaycheck.No]: 'Không',
    [OptionShowPaycheck.OnlyWhenNonZero]: 'Chỉ hiển thị nếu giá trị khác 0',
}
