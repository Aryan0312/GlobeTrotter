/**
 * @swagger
 * /:
 *   get:
 *     summary: Test endpoint
 *     description: Protected test endpoint that requires authentication
 *     tags: [Test]
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Test successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Test controller"
 *       401:
 *         description: Unauthorized - Login required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";

export const testController = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Test controller"
  });
});