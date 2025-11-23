import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormModalMoneyFundComponent } from './form-modal-money-fund.component';

describe('FormModalMoneyFundComponent', () => {
  let component: FormModalMoneyFundComponent;
  let fixture: ComponentFixture<FormModalMoneyFundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormModalMoneyFundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormModalMoneyFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
