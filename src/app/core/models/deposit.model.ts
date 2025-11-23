export interface Deposit {
  Id?: number;
  Date: string;
  MoneyFundId: number;
  MoneyFundName?: string;
  Amount: number;
  Comments?: string;
}
