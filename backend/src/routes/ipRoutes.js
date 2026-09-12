import { Router } from "express";
import { getIpLookup, getMyIp } from "../controllers/ipController.js";

const router = Router();

router.get("/my-ip", getMyIp);
router.get("/lookup/:ip", getIpLookup);

export default router;