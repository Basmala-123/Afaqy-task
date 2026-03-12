export interface SensorBound {
  min: number;
  max: number;
  unit: string;
}

export interface SensorBounds {
  [sensorType: string]: SensorBound;
}

export type SensorType = 'temperature' | 'humidity' | 'co2';

export const SENSOR_LABELS: Record<string, string> = {
  temperature: 'Temperature',
  humidity: 'Humidity',
  co2: 'CO₂'
};

