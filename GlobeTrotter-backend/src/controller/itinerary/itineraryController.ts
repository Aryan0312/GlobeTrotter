<<<<<<< HEAD
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
 * /api/itinerary-days/day/{dayId}:
 *   put:
 *     summary: Update itinerary day
 *     tags: [Itinerary]
 *     parameters:
 *       - in: path
 *         name: dayId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *       200:
 *         description: Itinerary day updated successfully
 *       400:
 *         description: No fields to update
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Itinerary day not found
 *   delete:
 *     summary: Delete itinerary day
 *     tags: [Itinerary]
 *     parameters:
 *       - in: path
 *         name: dayId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Itinerary day deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Itinerary day not found
 */

import { Request, Response } from "express";
import { pool } from "../../config/db";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/apiError";

=======
import { Request, Response } from "express";
import { pool } from "../../config/db";
import { ApiError } from "../../utils/apiError";
import { asyncHandler } from "../../utils/asyncHandler";

// Create itinerary day for a trip
>>>>>>> 278a5e8 (last commit we are able to complete)
export const createItineraryDay = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.session.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const { tripId } = req.params;
  const { dayNumber, date, city, country } = req.body;

  if (!dayNumber || !date) {
<<<<<<< HEAD
    throw new ApiError(400, "dayNumber and date are required");
  }

  const tripCheck = await pool.query(
    `SELECT id FROM trips WHERE id = $1 AND user_id = $2`,
=======
    throw new ApiError(400, "Day number and date are required");
  }

  // Verify trip belongs to user
  const tripCheck = await pool.query(
    "SELECT id FROM trips WHERE id = $1 AND user_id = $2",
>>>>>>> 278a5e8 (last commit we are able to complete)
    [tripId, userId]
  );

  if (tripCheck.rowCount === 0) {
    throw new ApiError(404, "Trip not found");
  }

<<<<<<< HEAD
  const insertQuery = `
    INSERT INTO itinerary_days (trip_id, day_number, date, city, country)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;

  const result = await pool.query(insertQuery, [
=======
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
>>>>>>> 278a5e8 (last commit we are able to complete)
    tripId,
    dayNumber,
    date,
    city || null,
    country || null
  ]);

  res.status(201).json({
    success: true,
<<<<<<< HEAD
    data: result.rows[0]
  });
});

export const getItineraryDaysByTrip = asyncHandler(async (req: Request, res: Response) => {
=======
    data: { id: result.rows[0].id }
  });
});

// Get itinerary days for a trip
export const getItineraryDays = asyncHandler(async (req: Request, res: Response) => {
>>>>>>> 278a5e8 (last commit we are able to complete)
  const userId = req.session.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const { tripId } = req.params;

<<<<<<< HEAD
  const result = await pool.query(
    `
    SELECT d.*
    FROM itinerary_days d
    JOIN trips t ON d.trip_id = t.id
    WHERE t.id = $1 AND t.user_id = $2
    ORDER BY d.day_number
    `,
    [tripId, userId]
  );

=======
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

>>>>>>> 278a5e8 (last commit we are able to complete)
  res.json({
    success: true,
    data: result.rows
  });
});

<<<<<<< HEAD
export const updateItineraryDay = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.session.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const { dayId } = req.params;
  const { dayNumber, date, city, country } = req.body;

  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (dayNumber) {
    fields.push(`day_number = $${idx++}`);
    values.push(dayNumber);
  }

  if (date) {
    fields.push(`date = $${idx++}`);
    values.push(date);
  }

  if (city !== undefined) {
    fields.push(`city = $${idx++}`);
    values.push(city);
  }

  if (country !== undefined) {
    fields.push(`country = $${idx++}`);
    values.push(country);
  }

  if (!fields.length) {
    throw new ApiError(400, "No fields to update");
  }

  const query = `
    UPDATE itinerary_days d
    SET ${fields.join(", ")}
    FROM trips t
    WHERE d.id = $${idx}
      AND d.trip_id = t.id
      AND t.user_id = $${idx + 1}
  `;

  values.push(dayId, userId);

  const result = await pool.query(query, values);

  if (result.rowCount === 0) {
    throw new ApiError(404, "Itinerary day not found");
  }

  res.json({
    success: true,
    message: "Itinerary day updated"
  });
});

export const deleteItineraryDay = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.session.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const { dayId } = req.params;

  const result = await pool.query(
    `
    DELETE FROM itinerary_days d
    USING trips t
    WHERE d.id = $1
      AND d.trip_id = t.id
      AND t.user_id = $2
    `,
    [dayId, userId]
  );

  if (result.rowCount === 0) {
    throw new ApiError(404, "Itinerary day not found");
  }

  res.json({
    success: true,
    message: "Itinerary day deleted"
  });
});

=======
// Create itinerary block for a day
>>>>>>> 278a5e8 (last commit we are able to complete)
export const createItineraryBlock = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.session.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const { dayId } = req.params;
  const { blockType, title, description, startTime, endTime, estimatedCost } = req.body;

<<<<<<< HEAD
  if (!blockType || !startTime || !endTime) {
    throw new ApiError(400, "blockType, startTime and endTime are required");
  }

  const allowedTypes = ["ACTIVITY", "REST", "SLEEP", "GAP"];
  if (!allowedTypes.includes(blockType)) {
    throw new ApiError(400, "Invalid block type");
  }

  if (startTime >= endTime) {
    throw new ApiError(400, "endTime must be after startTime");
  }

  const dayCheck = await pool.query(
    `
    SELECT d.id
    FROM itinerary_days d
    JOIN trips t ON d.trip_id = t.id
    WHERE d.id = $1 AND t.user_id = $2
    `,
    [dayId, userId]
  );
=======
  if (!blockType || !title || !startTime || !endTime) {
    throw new ApiError(400, "Block type, title, start time, and end time are required");
  }

  // Verify day belongs to user's trip
  const dayCheck = await pool.query(`
    SELECT id.id FROM itinerary_days id
    JOIN trips t ON id.trip_id = t.id
    WHERE id.id = $1 AND t.user_id = $2
  `, [dayId, userId]);
>>>>>>> 278a5e8 (last commit we are able to complete)

  if (dayCheck.rowCount === 0) {
    throw new ApiError(404, "Itinerary day not found");
  }

<<<<<<< HEAD
  const insertQuery = `
    INSERT INTO itinerary_blocks
      (itinerary_day_id, block_type, title, description, start_time, end_time, estimated_cost)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
  `;

  const result = await pool.query(insertQuery, [
    dayId,
    blockType,
    title || null,
=======
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
>>>>>>> 278a5e8 (last commit we are able to complete)
    description || null,
    startTime,
    endTime,
    estimatedCost || null
  ]);

  res.status(201).json({
    success: true,
<<<<<<< HEAD
    data: result.rows[0]
  });
});

export const getBlocksByDay = asyncHandler(async (req: Request, res: Response) => {
=======
    data: { id: result.rows[0].id }
  });
});

// Get itinerary blocks for a day
export const getItineraryBlocks = asyncHandler(async (req: Request, res: Response) => {
>>>>>>> 278a5e8 (last commit we are able to complete)
  const userId = req.session.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const { dayId } = req.params;

<<<<<<< HEAD
  const result = await pool.query(
    `
    SELECT b.*
    FROM itinerary_blocks b
    JOIN itinerary_days d ON b.itinerary_day_id = d.id
    JOIN trips t ON d.trip_id = t.id
    WHERE d.id = $1 AND t.user_id = $2
    ORDER BY b.start_time
    `,
    [dayId, userId]
  );
=======
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
>>>>>>> 278a5e8 (last commit we are able to complete)

  res.json({
    success: true,
    data: result.rows
  });
});

<<<<<<< HEAD
=======
// Update itinerary block
>>>>>>> 278a5e8 (last commit we are able to complete)
export const updateItineraryBlock = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.session.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const { blockId } = req.params;
  const { blockType, title, description, startTime, endTime, estimatedCost } = req.body;

<<<<<<< HEAD
=======
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

>>>>>>> 278a5e8 (last commit we are able to complete)
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (blockType) {
<<<<<<< HEAD
    const allowedTypes = ["ACTIVITY", "REST", "SLEEP", "GAP"];
    if (!allowedTypes.includes(blockType)) {
      throw new ApiError(400, "Invalid block type");
    }
    fields.push(`block_type = $${idx++}`);
    values.push(blockType);
  }

  if (startTime) {
    fields.push(`start_time = $${idx++}`);
    values.push(startTime);
  }

  if (endTime) {
    fields.push(`end_time = $${idx++}`);
    values.push(endTime);
  }

  if (title !== undefined) {
    fields.push(`title = $${idx++}`);
    values.push(title);
  }

=======
    fields.push(`block_type = $${idx++}`);
    values.push(blockType);
  }
  if (title) {
    fields.push(`title = $${idx++}`);
    values.push(title);
  }
>>>>>>> 278a5e8 (last commit we are able to complete)
  if (description !== undefined) {
    fields.push(`description = $${idx++}`);
    values.push(description);
  }
<<<<<<< HEAD

=======
  if (startTime) {
    fields.push(`start_time = $${idx++}`);
    values.push(startTime);
  }
  if (endTime) {
    fields.push(`end_time = $${idx++}`);
    values.push(endTime);
  }
>>>>>>> 278a5e8 (last commit we are able to complete)
  if (estimatedCost !== undefined) {
    fields.push(`estimated_cost = $${idx++}`);
    values.push(estimatedCost);
  }

  if (!fields.length) {
    throw new ApiError(400, "No fields to update");
  }

  const query = `
<<<<<<< HEAD
    UPDATE itinerary_blocks b
    SET ${fields.join(", ")}
    FROM itinerary_days d, trips t
    WHERE b.id = $${idx}
      AND b.itinerary_day_id = d.id
      AND d.trip_id = t.id
      AND t.user_id = $${idx + 1}
  `;

  values.push(blockId, userId);

  const result = await pool.query(query, values);

  if (result.rowCount === 0) {
    throw new ApiError(404, "Itinerary block not found");
  }

  res.json({
    success: true,
    message: "Itinerary block updated"
  });
});

=======
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
>>>>>>> 278a5e8 (last commit we are able to complete)
export const deleteItineraryBlock = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.session.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const { blockId } = req.params;

<<<<<<< HEAD
  const result = await pool.query(
    `
    DELETE FROM itinerary_blocks b
    USING itinerary_days d, trips t
    WHERE b.id = $1
      AND b.itinerary_day_id = d.id
      AND d.trip_id = t.id
      AND t.user_id = $2
    `,
    [blockId, userId]
  );

  if (result.rowCount === 0) {
    throw new ApiError(404, "Itinerary block not found");
  }

  res.json({
    success: true,
    message: "Itinerary block deleted"
=======
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
>>>>>>> 278a5e8 (last commit we are able to complete)
  });
});