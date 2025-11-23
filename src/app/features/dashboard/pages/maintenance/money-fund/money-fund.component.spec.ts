import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyFundComponent } from './money-fund.component';

describe('MoneyFundComponent', () => {
  let component: MoneyFundComponent;
  let fixture: ComponentFixture<MoneyFundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoneyFundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoneyFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
