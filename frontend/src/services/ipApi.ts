import type { IpLookupResponse } from "../types/ip";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function getMyIp(): Promise<string> {
  const response = await fetch(`${API_URL}/api/ip/my-ip`);

  if (!response.ok) {
    throw new Error("Failed to get your IP address");
  }

  const data = await response.json();

  return data.ip;
}

export async function lookupIp(ip: string): Promise<IpLookupResponse> {
  const response = await fetch(
    `${API_URL}/api/ip/lookup/${encodeURIComponent(ip)}`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to lookup IP address");
  }

  return data;
}