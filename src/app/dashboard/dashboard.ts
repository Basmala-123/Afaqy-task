import { AfterViewInit, Component, effect, inject, OnInit } from '@angular/core';
import { StatsCards } from './components/stats-cards/stats-cards';
import { Chart, registerables } from 'chart.js';
import { CustomChartCard } from './components/custom-chart-card/custom-chart-card';
import { MockDataService } from '../core/services/mock-data-service';
import { MatDialog } from '@angular/material/dialog';
import { AddEditChartDialog } from './components/add-edit-chart-dialog/add-edit-chart-dialog';
Chart.register(...registerables);
@Component({
  selector: 'app-dashboard',
  imports: [StatsCards, CustomChartCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit, AfterViewInit {
  public dataService = inject(MockDataService);
  private donutChart: Chart | undefined;
  private lineChart: Chart | undefined;
  private dialog = inject(MatDialog);

  constructor() {
    effect(() => {
      const rooms = this.dataService.rooms();
      if (this.donutChart && rooms.length > 0) {
        this.updateDonutChart();
      }
    });
  }
  ngOnInit() {
    this.dataService.loadInitialData().subscribe({
      next: () => {
        console.log('Data loaded successfully');
        // this.dataService.startLiveUpdates();
      },
      error: (err) => console.error('Failed to load data', err)
    });
  }
  ngAfterViewInit() {
    this.renderLineChart();
    this.renderDonutChart();
    console.log(this.dataService.customCharts());
  }

  renderLineChart() {
    this.lineChart = new Chart('tempTrendChart', {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Temperature',
          data: [21, 23, 22, 25, 24, 26, 25],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#fff',
          pointBorderColor: '#3b82f6',
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { 
            display: true, 
            grid: { color: 'rgba(0,0,0,0.05)' },
            border: { display: false }
          },
          x: { grid: { display: false } }
        }
      }
    });
  }

  renderDonutChart() {
   this.donutChart = new Chart('roomStatusChart', {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [0, 0],
          backgroundColor: ['#2563eb', '#f1f5f9'],
          borderWidth: 0
        }]
      },
      options: {
        cutout: '80%',
        plugins: { legend: { display: false } }
      }
    });
    this.updateDonutChart();
  }

  updateDonutChart() {
    const online = this.dataService.onlineRoomsCount();
    const offline = this.dataService.offlineRoomsCount();

    if (this.donutChart) {
      this.donutChart.data.datasets[0].data = [online, offline];
      this.donutChart.update();
    }
  }

    openAddChartDialog() {
    const dialogRef = this.dialog.open(AddEditChartDialog, {
      width: '500px',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newChart = { ...result, id: Date.now().toString(), order: this.dataService.customCharts().length + 1 };
        console.log(newChart); 
        this.dataService.customCharts.update(prev => [...prev, newChart]);
      }
    });
  }

  ngOnDestroy() {
    this.dataService.stopLiveUpdates();
  }
}
