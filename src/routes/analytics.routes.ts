import { Router } from "express";
import { getAnalytics } from "../controllers/analytics.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/:code", verifyJWT, getAnalytics);

export default router;
