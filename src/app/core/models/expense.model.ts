export interface Expense {
  Date: string;
  MoneyFundId: number;
  Comments?: string;
  MerchantName?: string;
  DocumentType: DocumentType;
  Details?: ExpenseDetail[];
}

export interface ExpenseDetail {
  ExpenseTypeId: number;
  Amount: number;
  Comments?: string;
}

export interface BudgetOverrun {
  ExpenseTypeId: number;
  ExpenseTypeName: string;
  BudgetAmount: number;
  ExecutedAmount: number;
  OverrunAmount: number;
}

export interface CreateExpenseResponse {
  ExpenseId: number;
  Overruns: BudgetOverrun[];
}

export enum DocumentType {
  Receipt,
  Invoice,
  Other,
}

export const DocumentTypeEs: Record<DocumentType, string> = {
  [DocumentType.Receipt]: 'Factura',
  [DocumentType.Invoice]: 'Recibo',
  [DocumentType.Other]: 'Otro',
};
