import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MockDataService } from '../../../core/services/mock-data-service';
import { ListViewDialog } from '../list-view-dialog/list-view-dialog';

@Component({
  selector: 'app-add-edit-chart-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ListViewDialog,
  ],
  templateUrl: './add-edit-chart-dialog.html',
  styleUrl: './add-edit-chart-dialog.scss',
})
export class AddEditChartDialog implements OnInit {
  private fb = inject(FormBuilder);
  public dataService = inject(MockDataService);
  private dialogRef = inject(MatDialogRef<AddEditChartDialog>);
  public data = inject(MAT_DIALOG_DATA, { optional: true });
  viewMode: 'form' | 'list' = 'form';
  newChartId: string = '';
  savedData: any = null;
  chartForm = this.fb.group({
    name: ['', Validators.required],
    sensorType: ['', Validators.required],
    roomIds: [[], Validators.required],
    ranges: this.fb.array([])
  });

  ngOnInit() {
    if (this.data?.chart) {
      this.patchForm(this.data.chart);
    }
  }

  get ranges() {
    return this.chartForm.get('ranges') as FormArray;
  }

  addRange() {
    const rangeGroup = this.fb.group({
      name: ['', Validators.required],
      from: [0, Validators.required],
      to: [0, Validators.required],
      color: ['#3498db']
    });
    this.ranges.push(rangeGroup);
  }

  removeRange(index: number) {
    this.ranges.removeAt(index);
  }

  onSave() {
    if (this.chartForm.valid) {
      const generatedId = Date.now().toString(); 
      const formData = this.chartForm.value;

      this.dataService.customCharts.update(prev => [
        ...prev, 
        { ...formData, id: generatedId }
      ]);
      this.newChartId = generatedId;
      this.viewMode = 'list'; 
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  private patchForm(chart: any) {
    this.chartForm.patchValue({
      name: chart.name,
      sensorType: chart.sensorType,
      roomIds: chart.roomIds
    });
    chart.ranges.forEach((r: any) => {
      this.ranges.push(this.fb.group(r));
    });
  }
}