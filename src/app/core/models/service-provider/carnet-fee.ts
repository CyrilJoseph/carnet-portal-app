export interface CarnetFee {
    feeCommissionId: number;
    feeType: string;
    description: string | null;
    commissionRate: number;
    effectiveDate: Date;
    spid: number;
}
