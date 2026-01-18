import { auth as betterAuth } from "../lib/auth";
import { NextFunction, Request, Response, } from "express";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name?: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}
export const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // get user session from request
     try {
      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });
      if (!session) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }
      if (!session.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "Email Verification Required please verify your email",
        });
      }

      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role as string,
        emailVerified: session.user.emailVerified,
      };

      if (roles.length && !roles.includes(req.user.role as UserRole)) {
        return res.status(403).json({
          success: false,
          message:
            "Forbidden! you don't have permission to access this resource.",
        });
      }
     }catch (error) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  };
};

export default auth;
