// import { SensorReadings } from './sensor.model';

export type RoomStatus = 'online' | 'offline';

export interface Room {
  id:      string;
  name:    string;
  floor:   number;
  status:  RoomStatus;
  sensors: SensorReadings;
}

export interface SensorReadings {
  temperature?: number;
  humidity?: number;
  co2?: number;
  [key: string]: number | undefined;
}

