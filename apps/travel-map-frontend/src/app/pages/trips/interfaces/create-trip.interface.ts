export interface CreateTripInterface {
  name: string;
  description: string;
  points: Array<{ lat: number; lng: number }>;
  startDate: Date;
  endDate: Date;
}
