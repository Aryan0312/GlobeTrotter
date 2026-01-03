import { Router } from "express";
import {
  createItineraryDay,
  getItineraryDays,
  createItineraryBlock,
  getItineraryBlocks,
  updateItineraryBlock,
  deleteItineraryBlock
} from "../controller/itinerary/itineraryController";
import { allowedRole } from "../middleware/authMiddleware";

const router = Router();

// Itinerary Days routes
router.post("/itinerary-days/:tripId", allowedRole(["USER", "ADMIN"]), createItineraryDay);
router.get("/itinerary-days/:tripId", allowedRole(["USER", "ADMIN"]), getItineraryDays);

// Itinerary Blocks routes
router.post("/itinerary/blocks/:dayId", allowedRole(["USER", "ADMIN"]), createItineraryBlock);
router.get("/itinerary/blocks/:dayId", allowedRole(["USER", "ADMIN"]), getItineraryBlocks);
router.put("/itinerary/blocks/block/:blockId", allowedRole(["USER", "ADMIN"]), updateItineraryBlock);
router.delete("/itinerary/blocks/block/:blockId", allowedRole(["USER", "ADMIN"]), deleteItineraryBlock);

export default router;