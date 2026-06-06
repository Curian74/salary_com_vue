export enum AutoSumEmployeeType {
    SameWorkingUnit = 1,
    UnderAuthority = 2
}

export enum CompositionNature {
    Income = 1,
    Deduction = 2,
    Other = 3
}

export enum CompositionType {
    EmployeeInfo = 1,          // Thông tin nhân viên
    Timekeeping = 2,           // Chấm công
    Revenue = 3,               // Doanh số
    KPI = 4,                   // KPI
    Product = 5,               // Sản phẩm
    Salary = 6,                // Lương
    PersonalIncomeTax = 7,     // Thuế TNCN
    InsuranceUnion = 8,        // Bảo hiểm - Công đoàn
    Other = 9                  // Khác
}

export enum DeductionType {
    TaxDeduction = 1
}

export enum IncomeTaxType {
    Taxable = 1,
    TaxFree = 2,
    PartialTaxFree = 3
}

export enum SourceType {
    UserAdded = 1,
    System = 2
}

export enum TrackingStatus {
    Inactive = 0,
    Active = 1
}

export enum ValueType {
    Number = 1,
    Currency = 2,
    Percentage = 3,
    Text = 4,
    Date = 5
}
