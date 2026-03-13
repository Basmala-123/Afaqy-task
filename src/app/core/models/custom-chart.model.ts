import { SensorType } from './sensor.model';
import { ChartRange } from './chart-range.model';

export interface CustomChart {
  id: string;
  name: string;
  order: number;
  totalRooms?:number;
  ranges: ChartRange[];
  roomIds: string[];
  sensorType: SensorType;
  liveStats:ChartRange[];
}

export interface ChartCountResult {
  rangeId: string;
  name: string;
  colour: string;
  count: number;
}
