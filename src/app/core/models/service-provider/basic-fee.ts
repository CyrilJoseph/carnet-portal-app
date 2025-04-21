export interface BasicFee {
    basicFeeId: number;
    startCarnetValue: number;
    endCarnetValue: number | null;
    fees: number;
    effectiveDate: Date;
    spid?: number;
}
