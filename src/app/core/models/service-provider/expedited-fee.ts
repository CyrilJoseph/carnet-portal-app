export interface ExpeditedFee {
    expeditedFeeId: number;
    customerType: string;
    deliveryType: string;
    startTime: Date;
    endTime: Date;
    timeZone: string;
    fee: number;
    effectiveDate: Date;
}
