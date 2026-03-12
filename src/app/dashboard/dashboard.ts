import { AfterViewInit, Component, effect, inject, OnInit } from '@angular/core';
import { StatsCards } from './components/stats-cards/stats-cards';
import { Chart, registerables } from 'chart.js';
import { CustomChartCard } from './components/custom-chart-card/custom-chart-card';
import { MockDataService } from '../core/services/mock-data-service';
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
        // 2. تشغيل محاكي السوكيت (التايمر اللي بيحدث كل ثانيتين)
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
    new Chart('tempTrendChart', {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Temperature',
          data: [20, 22, 25, 24, 28, 26, 27],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4, // بتخلي الخط ناعم (Curvy) زي الصورة
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { display: false }, x: { grid: { display: false } } }
      }
    });
  }

  renderDonutChart() {
    new Chart('roomStatusChart', {
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
    const online = this.dataService.rooms().filter(r => r.status === 'online').length;
    const offline = this.dataService.rooms().filter(r => r.status === 'offline').length;

    if (this.donutChart) {
      this.donutChart.data.datasets[0].data = [online, offline];
      this.donutChart.update();
    }
  }

  public openAddChartDialog() { }

  ngOnDestroy() {
    this.dataService.stopLiveUpdates();
  }
}
