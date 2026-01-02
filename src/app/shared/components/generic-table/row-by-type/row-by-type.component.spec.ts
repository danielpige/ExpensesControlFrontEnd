import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RowByTypeComponent } from './row-by-type.component';

describe('RowByTypeComponent', () => {
  let component: RowByTypeComponent;
  let fixture: ComponentFixture<RowByTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RowByTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RowByTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
