import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListViewDialog } from './list-view-dialog';

describe('ListViewDialog', () => {
  let component: ListViewDialog;
  let fixture: ComponentFixture<ListViewDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListViewDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListViewDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
