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

  const geo = geoip.lookup(ip);

  if (!geo) {
    return null;
  }

  const countryName = geo.country
    ? countryNames.of(geo.country)
    : null;

  const latitude = geo.ll?.[0] ?? null;
  const longitude = geo.ll?.[1] ?? null;

  // Check if this IP has already been saved.
  let lookup = await prisma.ipLookup.findFirst({
    where: {
      ip,
    },
  });

  // Only save the IP if it doesn't already exist.
  if (!lookup) {
    lookup = await prisma.ipLookup.create({
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
  }

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