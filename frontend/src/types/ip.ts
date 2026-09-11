export interface IpLookupResponse {
  ip: string;
  country: {
    code: string | null;
    name: string | null;
  };
  region: string | null;
  city: string | null;
  timezone: string | null;
  location: {
    latitude: number | null;
    longitude: number | null;
  };
}