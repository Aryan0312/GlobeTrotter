/**
 * @swagger
 * tags:
 *   name: Itinerary
 *   description: Itinerary day management endpoints
 */

import { Router } from "express";
import {
  createItineraryDay,
  getItineraryDaysByTrip,
  updateItineraryDay,
  deleteItineraryDay,
  createItineraryBlock,
  getBlocksByDay,
  updateItineraryBlock,
  deleteItineraryBlock
} from "../controller/itinerary/itineraryController";
import { allowedRole } from "../middleware/authMiddleware";

const router = Router();

router.post("/:tripId", allowedRole(["USER", "ADMIN"]), createItineraryDay);
router.get("/:tripId", allowedRole(["USER", "ADMIN"]), getItineraryDaysByTrip);
router.put("/day/:dayId", allowedRole(["USER", "ADMIN"]), updateItineraryDay);
router.delete("/day/:dayId", allowedRole(["USER", "ADMIN"]), deleteItineraryDay);

// Itinerary Blocks
router.post("/blocks/:dayId", allowedRole(["USER", "ADMIN"]), createItineraryBlock);
router.get("/blocks/:dayId", allowedRole(["USER", "ADMIN"]), getBlocksByDay);
router.put("/blocks/block/:blockId", allowedRole(["USER", "ADMIN"]), updateItineraryBlock);
router.delete("/blocks/block/:blockId", allowedRole(["USER", "ADMIN"]), deleteItineraryBlock);

export default router;