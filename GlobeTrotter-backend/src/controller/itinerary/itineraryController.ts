/**
 * @swagger
 * components:
 *   schemas:
 *     ItineraryDay:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         trip_id:
 *           type: string
 *         day_number:
 *           type: integer
 *         date:
 *           type: string
 *           format: date
 *         city:
 *           type: string
 *         country:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *     ItineraryBlock:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         itinerary_day_id:
 *           type: string
 *         block_type:
 *           type: string
 *           enum: [ACTIVITY, REST, SLEEP, GAP]
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         start_time:
 *           type: string
 *           format: time
 *         end_time:
 *           type: string
 *           format: time
 *         estimated_cost:
 *           type: number
 *         created_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/itinerary-days/{tripId}:
 *   post:
 *     summary: Create itinerary day for a trip
 *     tags: [Itinerary]
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dayNumber
 *               - date
 *             properties:
 *               dayNumber:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       201:
 *         description: Itinerary day created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Trip not found
 *   get:
 *     summary: Get all itinerary days for a trip
 *     tags: [Itinerary]
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of itinerary days
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/itinerary-days/blocks/{dayId}:
 *   post:
 *     summary: Create itinerary block for a day
 *     tags: [Itinerary]
 *     parameters:
 *       - in: path
 *         name: dayId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - blockType
 *               - title
 *               - startTime
 *               - endTime
 *             properties:
 *               blockType:
 *                 type: string
 *                 enum: [ACTIVITY, REST, SLEEP, GAP]
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: time
 *               endTime:
 *                 type: string
 *                 format: time
 *               estimatedCost:
 *                 type: number
 *     responses:
 *       201:
 *         description: Itinerary block created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Itinerary day not found
 *   get:
 *     summary: Get all blocks for an itinerary day
 *     tags: [Itinerary]
 *     parameters:
 *       - in: path
 *         name: dayId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of itinerary blocks
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/itinerary-days/blocks/block/{blockId}:
 *   put:
 *     summary: Update itinerary block
 *     tags: [Itinerary]
 *     parameters:
 *       - in: path
 *         name: blockId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               blockType:
 *                 type: string
 *                 enum: [ACTIVITY, REST, SLEEP, GAP]
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: time
 *               endTime:
 *                 type: string
 *                 format: time
 *               estimatedCost:
 *                 type: number
 *     responses:
 *       200:
 *         description: Itinerary block updated successfully
 *       400:
 *         description: Validation error or no fields to update
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Itinerary block not found
 *   delete:
 *     summary: Delete itinerary block
 *     tags: [Itinerary]
 *     parameters:
 *       - in: path
 *         name: blockId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Itinerary block deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Itinerary block not found
 */

import { Request, Response } from "express";
import { pool } from "../../config/db";
import { ApiError } from "../../utils/apiError";
import { asyncHandler } from "../../utils/asyncHandler";

// Create itinerary day for a trip
export const createItineraryDay = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.session.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const { tripId } = req.params;
  const { dayNumber, date, city, country } = req.body;

  if (!dayNumber || !date) {
    throw new ApiError(400, "Day number and date are required");
  }

  // Verify trip belongs to user
  const tripCheck = await pool.query(
    "SELECT id FROM trips WHERE id = $1 AND user_id = $2",
    [tripId, userId]
  );

  if (tripCheck.rowCount === 0) {
    throw new ApiError(404, "Trip not found");
  }

  const query = `
    INSERT INTO itinerary_days (
      trip_id,
      day_number,
      date,
      city,
      country
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `;

  const result = await pool.query(query, [
    tripId,
    dayNumber,
    date,
    city || null,
    country || null
  ]);

  res.status(201).json({
    success: true,
    data: { id: result.rows[0].id }
  });
});

// Get itinerary days for a trip
export const getItineraryDays = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.session.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const { tripId } = req.params;

  // Verify trip belongs to user
  const tripCheck = await pool.query(
    "SELECT id FROM trips WHERE id = $1 AND user_id = $2",
    [tripId, userId]
  );

  if (tripCheck.rowCount === 0) {
    throw new ApiError(404, "Trip not found");
  }

  const query = `
    SELECT id, day_number, date, city, country
    FROM itinerary_days 
    WHERE trip_id = $1 
    ORDER BY day_number ASC
  `;

  const result = await pool.query(query, [tripId]);

  res.json({
    success: true,
    data: result.rows
  });
});

// Create itinerary block for a day
export const createItineraryBlock = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.session.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const { dayId } = req.params;
  const { blockType, title, description, startTime, endTime, estimatedCost } = req.body;

  if (!blockType || !title || !startTime || !endTime) {
    throw new ApiError(400, "Block type, title, start time, and end time are required");
  }

  // Verify day belongs to user's trip
  const dayCheck = await pool.query(`
    SELECT id.id FROM itinerary_days id
    JOIN trips t ON id.trip_id = t.id
    WHERE id.id = $1 AND t.user_id = $2
  `, [dayId, userId]);

  if (dayCheck.rowCount === 0) {
    throw new ApiError(404, "Itinerary day not found");
  }

  const query = `
    INSERT INTO itinerary_blocks (
      itinerary_day_id,
      block_type,
      title,
      description,
      start_time,
      end_time,
      estimated_cost
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id
  `;

  const result = await pool.query(query, [
    dayId,
    blockType,
    title,
    description || null,
    startTime,
    endTime,
    estimatedCost || null
  ]);

  res.status(201).json({
    success: true,
    data: { id: result.rows[0].id }
  });
});

// Get itinerary blocks for a day
export const getItineraryBlocks = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.session.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const { dayId } = req.params;

  // Verify day belongs to user's trip
  const dayCheck = await pool.query(`
    SELECT id.id FROM itinerary_days id
    JOIN trips t ON id.trip_id = t.id
    WHERE id.id = $1 AND t.user_id = $2
  `, [dayId, userId]);

  if (dayCheck.rowCount === 0) {
    throw new ApiError(404, "Itinerary day not found");
  }

  const query = `
    SELECT id, block_type, title, description, start_time, end_time, estimated_cost
    FROM itinerary_blocks 
    WHERE itinerary_day_id = $1 
    ORDER BY start_time ASC
  `;

  const result = await pool.query(query, [dayId]);

  res.json({
    success: true,
    data: result.rows
  });
});

// Update itinerary block
export const updateItineraryBlock = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.session.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const { blockId } = req.params;
  const { blockType, title, description, startTime, endTime, estimatedCost } = req.body;

  // Verify block belongs to user's trip
  const blockCheck = await pool.query(`
    SELECT ib.id FROM itinerary_blocks ib
    JOIN itinerary_days id ON ib.itinerary_day_id = id.id
    JOIN trips t ON id.trip_id = t.id
    WHERE ib.id = $1 AND t.user_id = $2
  `, [blockId, userId]);

  if (blockCheck.rowCount === 0) {
    throw new ApiError(404, "Itinerary block not found");
  }

  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (blockType) {
    fields.push(`block_type = $${idx++}`);
    values.push(blockType);
  }
  if (title) {
    fields.push(`title = $${idx++}`);
    values.push(title);
  }
  if (description !== undefined) {
    fields.push(`description = $${idx++}`);
    values.push(description);
  }
  if (startTime) {
    fields.push(`start_time = $${idx++}`);
    values.push(startTime);
  }
  if (endTime) {
    fields.push(`end_time = $${idx++}`);
    values.push(endTime);
  }
  if (estimatedCost !== undefined) {
    fields.push(`estimated_cost = $${idx++}`);
    values.push(estimatedCost);
  }

  if (!fields.length) {
    throw new ApiError(400, "No fields to update");
  }

  const query = `
    UPDATE itinerary_blocks
    SET ${fields.join(", ")}
    WHERE id = $${idx}
  `;

  values.push(blockId);
  await pool.query(query, values);

  res.json({
    success: true,
    message: "Block updated successfully"
  });
});

// Delete itinerary block
export const deleteItineraryBlock = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.session.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const { blockId } = req.params;

  // Verify block belongs to user's trip
  const blockCheck = await pool.query(`
    SELECT ib.id FROM itinerary_blocks ib
    JOIN itinerary_days id ON ib.itinerary_day_id = id.id
    JOIN trips t ON id.trip_id = t.id
    WHERE ib.id = $1 AND t.user_id = $2
  `, [blockId, userId]);

  if (blockCheck.rowCount === 0) {
    throw new ApiError(404, "Itinerary block not found");
  }

  await pool.query("DELETE FROM itinerary_blocks WHERE id = $1", [blockId]);

  res.json({
    success: true,
    message: "Block deleted successfully"
  });
});