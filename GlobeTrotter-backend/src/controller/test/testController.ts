import { Request, request, Response, response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";

export const testController = asyncHandler((req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Test controller"
  });
});