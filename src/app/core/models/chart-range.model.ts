import { CustomChart } from "./custom-chart.model";

export interface ChartRange {
  id: string;
  name: string;
  from: number;
  to: number;
  color: string;
  count?: number;
}

export interface ChartSegment {
  range: ChartRange;
  count: number;
  rooms: string[];
}

export interface ComputedChart {
  chart: CustomChart;
  segments: ChartSegment[];
  totalRooms: number;
}
