import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormModalBudgetComponent } from './form-modal-budget.component';

describe('FormModalBudgetComponent', () => {
  let component: FormModalBudgetComponent;
  let fixture: ComponentFixture<FormModalBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormModalBudgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormModalBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
