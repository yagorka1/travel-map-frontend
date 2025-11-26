export interface LeaderboardUser {
  id: string;
  name: string;
  avatarUrl?: string;
  points: number;
  tripsCount: number;
}

export interface LeaderboardTrip {
  id: string;
  name: string;
  distance: number;
  points: number;
  startDate: Date;
  endDate: Date;
  userId: string;
  userName: string;
}
