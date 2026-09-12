import geoip from "geoip-lite";
import net from "node:net";
import prisma from "../lib/prisma.js";

const countryNames = new Intl.DisplayNames(["en"], {
  type: "region",
});

function isPrivateIp(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);

    return (
      a === 10 ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      a === 127 ||
      a === 0
    );
  }

  if (net.isIPv6(ip)) {
    const normalized = ip.toLowerCase();

    return (
      normalized === "::1" ||
      normalized.startsWith("fc") ||
      normalized.startsWith("fd") ||
      normalized.startsWith("fe80:")
    );
  }

  return false;
}

export async function lookupIp(ip) {
  if (!net.isIP(ip)) {
    const error = new Error("Invalid IP address");
    error.statusCode = 400;
    throw error;
  }

  if (isPrivateIp(ip)) {
    const error = new Error(
      "Private or local IP addresses cannot be geolocated",
    );
    error.statusCode = 400;
    throw error;
  }

  console.log(`[IP Lookup] Checking database for: ${ip}`);

  const existingLookup = await prisma.ipLookup.findFirst({
    where: {
      ip,
    },
  });

  if (existingLookup) {
    console.log(`[IP Lookup] Found in database: ${ip}`);

    return {
      ip: existingLookup.ip,
      country: {
        code: existingLookup.country,
        name: existingLookup.countryName,
      },
      region: existingLookup.region,
      city: existingLookup.city,
      timezone: existingLookup.timezone,
      location: {
        latitude: existingLookup.latitude,
        longitude: existingLookup.longitude,
      },
    };
  }

  console.log(`[IP Lookup] Not found in database. Looking up geoip: ${ip}`);

  const geo = geoip.lookup(ip);

  if (!geo) {
    console.log(`[IP Lookup] No geolocation found: ${ip}`);
    return null;
  }

  console.log(`[IP Lookup] Geolocation found: ${ip}`);

  const countryName = geo.country
    ? countryNames.of(geo.country)
    : null;

  const latitude = geo.ll?.[0] ?? null;
  const longitude = geo.ll?.[1] ?? null;

  const lookup = await prisma.ipLookup.create({
    data: {
      ip,
      country: geo.country ?? null,
      countryName,
      region: geo.region || null,
      city: geo.city || null,
      timezone: geo.timezone ?? null,
      latitude,
      longitude,
    },
  });

  console.log(`[IP Lookup] Saved to database: ${ip}`);

  return {
    ip: lookup.ip,
    country: {
      code: lookup.country,
      name: lookup.countryName,
    },
    region: lookup.region,
    city: lookup.city,
    timezone: lookup.timezone,
    location: {
      latitude: lookup.latitude,
      longitude: lookup.longitude,
    },
  };
}