import { AfterViewInit, ChangeDetectorRef, Component, effect, inject, Input } from '@angular/core';
import { Chart } from 'chart.js';
import { CdkDragDrop, moveItemInArray,DragDropModule } from '@angular/cdk/drag-drop';
import { MockDataService } from '../../../core/services/mock-data-service';
import { AddEditChartDialog } from '../add-edit-chart-dialog/add-edit-chart-dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-custom-chart-card',
  imports: [DragDropModule],
  templateUrl: './custom-chart-card.html',
  styleUrl: './custom-chart-card.scss',
})
export class CustomChartCard implements AfterViewInit{
  private dataService = inject(MockDataService)
  private dialog = inject(MatDialog);
  constructor() {
    effect(() => {
      const data = this.dataService.mappedCustomCharts();
      if (data && data.length > 0) {
        setTimeout(() => this.updateAllCharts(), 50);
      }
    });
  }

  public get chartList() {
    return this.dataService.mappedCustomCharts();
  }

  ngAfterViewInit() {
    this.updateAllCharts();
  }

  updateAllCharts() {
    this.chartList.forEach(chart => {
      const canvasId = `chart-${chart.id}`;
      const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
      
      if (!canvas) return;

      const dataValues = chart.liveStats.map((s: any) => s.count);
      const colors = chart.liveStats.map((s: any) => s.color);
      const existingChart = Chart.getChart(canvasId);

      if (existingChart) {
        existingChart.data.datasets[0].data = dataValues;
        existingChart.update('none'); 
      } else {
        new Chart(canvas, {
          type: 'doughnut',
          data: {
            datasets: [{
              data: dataValues,
              backgroundColor: colors,
              borderWidth: 0,
              spacing: 5,
              borderRadius: 4
            }]
          },
          options: {
            cutout: '80%',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
          }
        });
      }
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    this.destroyAllCharts()
    const currentArray = [...this.dataService.customCharts()];
    
    moveItemInArray(currentArray, event.previousIndex, event.currentIndex);
    const updatedArray = currentArray.map((chart, index) => ({
    ...chart,
    order: index + 1 
  }));
  this.dataService.customCharts.set(updatedArray);
  }
  destroyAllCharts() {
    this.chartList.forEach(chart => {
      const existingChart = Chart.getChart(`chart-${chart.id}`);
      if (existingChart) {
        existingChart.destroy();
      }
    });
  }

  ngOnDestroy() {
    this.destroyAllCharts();
  }
    onAddChartClick() {
    const dialogRef = this.dialog.open(AddEditChartDialog, {
      width: '500px',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newChart = { ...result, id: Date.now().toString(), order: this.dataService.customCharts().length + 1 };
        this.dataService.customCharts.update(prev => [...prev, newChart]);
      }
    });
  }
}
