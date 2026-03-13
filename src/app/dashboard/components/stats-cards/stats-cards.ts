import { Component, inject } from '@angular/core';
import { MockDataService } from '../../../core/services/mock-data-service';

@Component({
  selector: 'app-stats-cards',
  imports: [],
  templateUrl: './stats-cards.html',
  styleUrl: './stats-cards.scss',
})
export class StatsCards {
  public dataService = inject(MockDataService);
}
