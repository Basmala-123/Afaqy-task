import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditChartDialog } from './add-edit-chart-dialog';

describe('AddEditChartDialog', () => {
  let component: AddEditChartDialog;
  let fixture: ComponentFixture<AddEditChartDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditChartDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditChartDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
