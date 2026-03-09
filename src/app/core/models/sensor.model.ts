export type SensorType = 'temperature' | 'humidity' | 'co2';

export const SENSOR_LABELS: Record<SensorType, string> = {
  temperature: 'Temperature',
  humidity:    'Humidity',
  co2:         'CO₂',
};

export const SENSOR_UNITS: Record<SensorType, string> = {
  temperature: '°C',
  humidity:    '%',
  co2:         'ppm',
};

export interface SensorBounds {
  min: number;
  max: number;
}

export type SensorBoundsMap = Record<SensorType, SensorBounds>;
export type SensorReadings  = Partial<Record<SensorType, number | null>>;
