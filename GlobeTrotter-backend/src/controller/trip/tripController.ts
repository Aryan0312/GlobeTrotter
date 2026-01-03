import { Request, Response } from "express";
import { pool } from "../../config/db";
import { ApiError } from "../../utils/apiError";
import { asyncHandler } from "../../utils/asyncHandler";

export const createTrip = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.session.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const { title, description, startDate, endDate, coverPhotoUrl } = req.body;

  if (!title || !startDate || !endDate) {
    throw new ApiError(400, "Missing required fields");
  }

  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start < new Date(today.setHours(0, 0, 0, 0))) {
    throw new ApiError(400, "Trip start date cannot be in the past");
  }

  if (end < start) {
    throw new ApiError(400, "End date cannot be before start date");
  }

  const query = `
    INSERT INTO trips (
      user_id,
      title,
      description,
      start_date,
      end_date,
      cover_photo_url
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;

  const result = await pool.query(query, [
    userId,
    title,
    description || null,
    startDate,
    endDate,
    coverPhotoUrl || null
  ]);

  res.status(201).json({
    success: true,
    data: result.rows[0]
  });
});

export const getUserTrips = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.session.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const query = `SELECT * FROM trips WHERE user_id = $1 ORDER BY created_at DESC`;
  const result = await pool.query(query, [userId]);

  res.json({
    success: true,
    data: result.rows
  });
});

export const getTripById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.session.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const tripId = req.params.id;
  const query = `SELECT * FROM trips WHERE id = $1 AND user_id = $2`;
  const result = await pool.query(query, [tripId, userId]);

  if (result.rowCount === 0) {
    throw new ApiError(404, "Trip not found");
  }

  res.json({
    success: true,
    data: result.rows[0]
  });
});

export const updateTrip = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.session.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const tripId = req.params.id;
  const { title, description, startDate, endDate, coverPhotoUrl } = req.body;

  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (startDate) {
    const start = new Date(startDate);
    if (start < new Date(new Date().setHours(0, 0, 0, 0))) {
      throw new ApiError(400, "Trip start date cannot be in the past");
    }
    fields.push(`start_date = $${idx++}`);
    values.push(startDate);
  }

  if (endDate) {
    fields.push(`end_date = $${idx++}`);
    values.push(endDate);
  }

  if (title) {
    fields.push(`title = $${idx++}`);
    values.push(title);
  }

  if (description !== undefined) {
    fields.push(`description = $${idx++}`);
    values.push(description);
  }

  if (coverPhotoUrl !== undefined) {
    fields.push(`cover_photo_url = $${idx++}`);
    values.push(coverPhotoUrl);
  }

  if (!fields.length) {
    throw new ApiError(400, "No fields to update");
  }

  const query = `
    UPDATE trips
    SET ${fields.join(", ")}
    WHERE id = $${idx} AND user_id = $${idx + 1}
  `;

  values.push(tripId, userId);

  const result = await pool.query(query, values);

  if (result.rowCount === 0) {
    throw new ApiError(404, "Trip not found");
  }

  res.json({
    success: true,
    message: "Trip updated successfully"
  });
});

export const deleteTrip = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.session.user?.userId;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const tripId = req.params.id;
  const query = `DELETE FROM trips WHERE id = $1 AND user_id = $2`;
  const result = await pool.query(query, [tripId, userId]);

  if (result.rowCount === 0) {
    throw new ApiError(404, "Trip not found");
  }

  res.json({
    success: true,
    message: "Trip deleted successfully"
  });
});