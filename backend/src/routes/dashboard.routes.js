import express from "express";
const router = express.Router();
import {
  summary,
  categoryTotals,
  monthlyTrends,
  recentActivity,
} from "../controllers/dashboard.controller.js";
import authenticate from "../middleware/authenticate.js";
import authorizeRoles from "../middleware/authorizeRoles.js";

router.use(authenticate);

router.get("/summary", authorizeRoles("viewer", "analyst", "admin"), summary);
router.get("/categories", authorizeRoles("analyst", "admin"), categoryTotals);
router.get("/trends", authorizeRoles("analyst", "admin"), monthlyTrends);
router.get("/recent", authorizeRoles("analyst", "admin"), recentActivity);

export default router;
