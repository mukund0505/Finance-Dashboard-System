import express from "express";
const router = express.Router();
import {
  create,
  getAll,
  getOne,
  update,
  remove,
} from "../controllers/record.controller.js";
import authenticate from "../middleware/authenticate.js";
import authorizeRoles from "../middleware/authorizeRoles.js";
import { recordValidator } from "../validators/record.validator.js";

router.use(authenticate); // all record routes require login

router.get("/", authorizeRoles("viewer", "analyst", "admin"), getAll);
router.get("/:id", authorizeRoles("viewer", "analyst", "admin"), getOne);
router.post("/", authorizeRoles("admin"), recordValidator, create);
router.put("/:id", authorizeRoles("admin"), recordValidator, update);
router.delete("/:id", authorizeRoles("admin"), remove);

export default router;
