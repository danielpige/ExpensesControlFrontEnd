export interface MoneyFund {
  Id?: number;
  Name: string;
  AccountType: AccountType;
  InitialBalance?: string;
  CurrentBalance?: string;
  IsActive?: boolean;
}

export enum AccountType {
  SAVINGS = 'SAVINGS', // Cuenta de ahorros
  CHECKING = 'CHECKING', // Cuenta corriente
  CASH = 'CASH', // Efectivo / Caja
  CREDIT_CARD = 'CREDIT_CARD', // Tarjeta de crédito
  INVESTMENT = 'INVESTMENT', // Cuenta de inversión
  LOAN = 'LOAN', // Cuenta de préstamo
  OTHER = 'OTHER', // Otro tipo de cuenta
}

export const AccountTypeEs: Record<AccountType, string> = {
  [AccountType.SAVINGS]: 'Cuenta de ahorros',
  [AccountType.CHECKING]: 'Cuenta corriente',
  [AccountType.CASH]: 'Efectivo / Caja',
  [AccountType.CREDIT_CARD]: 'Tarjeta de crédito',
  [AccountType.INVESTMENT]: 'Cuenta de inversión',
  [AccountType.LOAN]: 'Cuenta de préstamo',
  [AccountType.OTHER]: 'Otro',
};
