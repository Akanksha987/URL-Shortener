import { Router } from "express";
import {
  createShortUrl,
  deleteShortUrl,
  listShortUrls,
} from "../controllers/url.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", verifyJWT, createShortUrl);
router.get("/", verifyJWT, listShortUrls);
router.delete("/:code", verifyJWT, deleteShortUrl);

export default router;
