<<<<<<< HEAD
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
=======
import { Router } from "express";
import {
  createItineraryDay,
  getItineraryDays,
  createItineraryBlock,
  getItineraryBlocks,
>>>>>>> 278a5e8 (last commit we are able to complete)
  updateItineraryBlock,
  deleteItineraryBlock
} from "../controller/itinerary/itineraryController";
import { allowedRole } from "../middleware/authMiddleware";

const router = Router();

<<<<<<< HEAD
router.post("/:tripId", allowedRole(["USER", "ADMIN"]), createItineraryDay);
router.get("/:tripId", allowedRole(["USER", "ADMIN"]), getItineraryDaysByTrip);
router.put("/day/:dayId", allowedRole(["USER", "ADMIN"]), updateItineraryDay);
router.delete("/day/:dayId", allowedRole(["USER", "ADMIN"]), deleteItineraryDay);

// Itinerary Blocks
router.post("/blocks/:dayId", allowedRole(["USER", "ADMIN"]), createItineraryBlock);
router.get("/blocks/:dayId", allowedRole(["USER", "ADMIN"]), getBlocksByDay);
router.put("/blocks/block/:blockId", allowedRole(["USER", "ADMIN"]), updateItineraryBlock);
router.delete("/blocks/block/:blockId", allowedRole(["USER", "ADMIN"]), deleteItineraryBlock);
=======
// Itinerary Days routes
router.post("/itinerary-days/:tripId", allowedRole(["USER", "ADMIN"]), createItineraryDay);
router.get("/itinerary-days/:tripId", allowedRole(["USER", "ADMIN"]), getItineraryDays);

// Itinerary Blocks routes
router.post("/itinerary/blocks/:dayId", allowedRole(["USER", "ADMIN"]), createItineraryBlock);
router.get("/itinerary/blocks/:dayId", allowedRole(["USER", "ADMIN"]), getItineraryBlocks);
router.put("/itinerary/blocks/block/:blockId", allowedRole(["USER", "ADMIN"]), updateItineraryBlock);
router.delete("/itinerary/blocks/block/:blockId", allowedRole(["USER", "ADMIN"]), deleteItineraryBlock);
>>>>>>> 278a5e8 (last commit we are able to complete)

export default router;