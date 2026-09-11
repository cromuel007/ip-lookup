import { Router } from "express";
import { getIpLookup } from "../controllers/ipController.js";

const router = Router();

router.get("/lookup/:ip", getIpLookup);

export default router;