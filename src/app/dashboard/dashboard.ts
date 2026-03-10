import { Component } from '@angular/core';
import { StatsCards } from '../shared/components/stats-cards/stats-cards';

@Component({
  selector: 'app-dashboard',
  imports: [StatsCards],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

  public openAddChartDialog(){}
}
