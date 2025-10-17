// backend/src/routes/auth.ts
import { Router } from "express";
import { signup, login, me, pushToken, updatePushToken } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authMiddleware, me);
router.post("/push-token", authMiddleware, pushToken)
router.post("/updatePushToken", authMiddleware, updatePushToken)

export default router;