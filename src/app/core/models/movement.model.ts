export interface Movement {
  Date: string;
  MovementType: MovementType;
  MoneyFundName: string;
  Amount: number;
  Description?: string;
}

export enum MovementType {
  EXPENSE = 'Expense',
  DEPOSIT = 'Deposit',
}

export const MovementTypeEs: Record<MovementType, string> = {
  [MovementType.DEPOSIT]: 'Desposito',
  [MovementType.EXPENSE]: 'Gasto',
};
