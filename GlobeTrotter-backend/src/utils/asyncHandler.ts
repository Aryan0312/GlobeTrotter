import { Request, Response, NextFunction } from "express";

// amazonq-ignore-next-line
export const asyncHandler = (fn: any) => {

  return (req: Request, res: Response, next: NextFunction) => {
   
    fn(req, res, next).catch(next);

  };
};
