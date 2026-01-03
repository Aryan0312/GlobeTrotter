import { Request, Response, NextFunction } from "express";

// Extend Request interface to include session
declare module "express-serve-static-core" {
  interface Request {
    session: {
      user?: {
        userId: string;
        email: string;
        roles: string[];
      };
    };
  }
}
 

export function allowedRole(allowedRoles: string[]){
    return function (req:Request,res:Response,next:NextFunction) {
        const user= req.session.user;
        
        if(!user) return res.status(401).json({
            success: false,
            message:"Login to continue!"
        });

        if(!allowedRoles.includes(user.roles[0])){
            return res.status(403).json({
            success: false,
            message:"You are not authorised to access this!"
            });
        }

      
        next();
    };
}