import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Room } from '../models/room.model';
import { SensorBounds } from '../models/sensor.model';
import { CustomChart } from '../models/custom-chart.model';

interface MockData {
  rooms: Room[];
  customCharts: CustomChart[];
  chartOrder: string[];
  sensorBounds: SensorBounds;
}

@Injectable({ providedIn: 'root' })
export class MockDataService{
  rooms = signal<any[]>([]);
  customCharts = signal<any[]>([]);
  private socketInterval: any;
  mappedCustomCharts = computed(() => {
    const allRooms = this.rooms();
    const configs = this.customCharts();

    return configs.map(chart => {
      const targetRooms = allRooms.filter(room => chart.roomIds.includes(room.id) && room.status === 'online');
      const liveStats = chart.ranges.map((range: any) => {
        const count = targetRooms.filter(room => {
          const sensor = room.sensors.find((s: any) => s.type === chart.sensorType);
          const value = sensor ? sensor.value : 0;
          return value >= range.from && value < range.to;
        }).length;

        return { ...range, count };
      });

      return {
        ...chart,
        liveStats,
        totalRooms: targetRooms.length
      };
    });

  });

  onlineRoomsCount = computed(() => 
    this.rooms().filter(r => r.status === 'online').length
  );

  offlineRoomsCount = computed(() => 
    this.rooms().filter(r => r.status === 'offline').length
  );

  onlinePercentage = computed(() => {
    const total = this.rooms().length;
    return total > 0 ? Math.round((this.onlineRoomsCount() / total) * 100) : 0;
  });

  offlinePercentage = computed(() => {
    const total = this.rooms().length;
    return total > 0 ? Math.round((this.offlineRoomsCount() / total) * 100) : 0;
  });
  

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<MockData>('/data/mock-data.json').pipe(
      tap(data => {
        this.rooms.set(data.rooms);
        this.customCharts.set(data.customCharts);
      })
    );
  }
  startLiveUpdates() {
    if (this.socketInterval) return;

    this.socketInterval = setInterval(() => {
      const allRooms = this.rooms();
      if (allRooms.length === 0) return;

      const randomIndex = Math.floor(Math.random() * allRooms.length);
      const randomRoom = allRooms[randomIndex];
      const randomSensor = randomRoom.sensors[Math.floor(Math.random() * randomRoom.sensors.length)];
      
      this.updateSensorValue({
        roomId: randomRoom.id,
        sensorType: randomSensor.type,
        value: this.generateRandomValue(randomSensor.type)
      });

      const statusRoom = allRooms[Math.floor(Math.random() * allRooms.length)];
      this.updateRoomStatus(statusRoom.id, Math.random() > 0.1 ? 'online' : 'offline');

      console.log(`[Mock Socket] Updated Room: ${randomRoom.id}`);
    }, 2000);
  }

  stopLiveUpdates() {
    if (this.socketInterval) {
      clearInterval(this.socketInterval);
      this.socketInterval = null;
    }
  }

  private generateRandomValue(type: string): number {
    if (type === 'temperature') return +(Math.random() * (30 - 18) + 18).toFixed(1);
    if (type === 'humidity') return Math.floor(Math.random() * (70 - 30) + 30);
    if (type === 'co2') return Math.floor(Math.random() * (1200 - 400) + 400);
    return 0;
  }

  updateSensorValue(payload: any) {
    this.rooms.update(prev => prev.map(r => {
      if (r.id === payload.roomId) {
        return {
          ...r,
          sensors: r.sensors.map((s: any) => s.type === payload.sensorType ? { ...s, value: payload.value } : s)
        };
      }
      return r;
    }));
  }

  updateRoomStatus(roomId: string, status: 'online' | 'offline') {
    this.rooms.update(prev => prev.map(r => r.id === roomId ? { ...r, status } : r));
  }

}
