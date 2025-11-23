import { Pipe, PipeTransform } from '@angular/core';
import { AccountType, AccountTypeEs } from '../../core/models/moneyFund.model';

@Pipe({
  name: 'accountTypeTranslate',
})
export class AccountTypeTranslatePipe implements PipeTransform {
  transform(value: AccountType | string | null | undefined): string {
    if (!value) return '';

    // Acepta tanto el enum como el string
    const key = value as AccountType;

    return AccountTypeEs[key] ?? String(value);
  }
}
