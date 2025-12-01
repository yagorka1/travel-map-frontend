export interface MostVisitedLocation {
  name: string;
  count: number;
}

export interface DashboardStats {
  totalTrips: number;
  totalDistance: number;
  visitedCities: number;
  visitedCountries: number;
  mostVisitedCity: MostVisitedLocation;
  mostVisitedCountry: MostVisitedLocation;
  averageTripDuration: number;
  totalPoints: number;
  visitedCountriesList: string[];
}
