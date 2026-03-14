import { Component, computed, inject, Input, input } from '@angular/core';
import { MockDataService } from '../../../core/services/mock-data-service';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AddEditChartDialog } from '../add-edit-chart-dialog/add-edit-chart-dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-list-view-dialog',
  imports: [ MatDialogModule,MatIcon],
  templateUrl: './list-view-dialog.html',
  styleUrl: './list-view-dialog.scss',
})
export class ListViewDialog {
  public dataService = inject(MockDataService);
  private dialogRef = inject(MatDialogRef<AddEditChartDialog>);
  chartId = input.required<string>();
  currentChart = computed(() => 
    this.dataService.mappedCustomCharts().find(c => c.id === this.chartId())
  );
  roomDetails = computed(() => {
    const chart = this.currentChart();
    if (!chart) return [];

    return this.dataService.rooms()
      .filter(room => chart.roomIds.includes(room.id))
      .map(room => {
        const sensor = room.sensors.find((s: any) => s.type === chart.sensorType);
        const value = sensor ? sensor.value : 0;
        const range = chart.ranges.find((r: any) => value >= r.from && value < r.to) 
                      || { name: 'N/A', color: '#ccc' };

        return {
          name: room.name,
          value: value,
          status: room.status,
          rangeName: range.name,
          rangeColor: range.color,
          unit: chart.sensorType === 'temperature' ? '°C' : '%'
        };
      });
  });
  onCancel() {
    this.dialogRef.close();
  }
}
