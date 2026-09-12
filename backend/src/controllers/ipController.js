import { lookupIp } from "../services/ipService.js";

export async function getMyIp(req, res) {
  const ipAddress =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    null;

  return res.json({
    ip: ipAddress,
  });
}

export async function getIpLookup(req, res) {
  try {
    const { ip } = req.params;

    const result = await lookupIp(ip);

    if (!result) {
      return res.status(404).json({
        error: "IP address location not found",
      });
    }

    return res.json(result);
  } catch (error) {
    console.error("IP lookup error:", error);

    if (error.statusCode === 400) {
      return res.status(400).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: "Failed to lookup IP address",
    });
  }
}