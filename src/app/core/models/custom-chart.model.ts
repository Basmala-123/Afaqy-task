import { SensorType } from './sensor.model';
import { ChartRange } from './chart-range.model';

export interface CustomChart {
  id: string;
  order: number;
  name: string;
  roomIds: string[];
  sensorType: SensorType;
  ranges: ChartRange[];
}

export interface ChartCountResult {
  rangeId: string;
  name: string;
  colour: string;
  count: number;
}
