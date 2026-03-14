import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomChartCard } from './custom-chart-card';

describe('CustomChartCard', () => {
  let component: CustomChartCard;
  let fixture: ComponentFixture<CustomChartCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomChartCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomChartCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
