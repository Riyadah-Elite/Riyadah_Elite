/**
 * @author aliasgarbootwala3@gmial.com
 */

import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: import("./user.types.js").UserRole;
      };
    }
  }
}

export {};
