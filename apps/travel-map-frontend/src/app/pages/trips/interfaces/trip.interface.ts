export interface TripInterface {
  id: string;
  userId: string;
  name: string;
  description: string;
  geometry: {
    type: 'LineString';
    coordinates: number[][];
  };
  distance: number;
  pointsEarned: number;
  startDate: string;
  endDate: string;
  createdAt: string;
}
