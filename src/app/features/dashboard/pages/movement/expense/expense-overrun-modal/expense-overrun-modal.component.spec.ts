import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseOverrunModalComponent } from './expense-overrun-modal.component';

describe('ExpenseOverrunModalComponent', () => {
  let component: ExpenseOverrunModalComponent;
  let fixture: ComponentFixture<ExpenseOverrunModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpenseOverrunModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseOverrunModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
