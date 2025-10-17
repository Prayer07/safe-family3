// backend/src/routes/family.ts
import { Router } from "express";
import { createFamily, joinFamily, getMyFamily } from "../controllers/familyController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", authMiddleware, createFamily);
router.post("/join", authMiddleware, joinFamily);
router.get("/me", authMiddleware, getMyFamily);

export default router;