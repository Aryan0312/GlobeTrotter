/**
 * @swagger
 * tags:
 *   name: Trips
 *   description: Trip management endpoints
 */

import { Router } from "express";
import {
  createTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip
} from "../controller/trip/tripController";
import { allowedRole } from "../middleware/authMiddleware";

const router = Router();

router.post("/", allowedRole(["USER", "ADMIN"]), createTrip);
router.get("/", allowedRole(["USER", "ADMIN"]), getUserTrips);
router.get("/:id", allowedRole(["USER", "ADMIN"]), getTripById);
router.put("/:id", allowedRole(["USER", "ADMIN"]), updateTrip);
router.delete("/:id", allowedRole(["USER", "ADMIN"]), deleteTrip);

export default router;