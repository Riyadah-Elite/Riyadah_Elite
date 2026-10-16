/**
 * @author aliasgarbootwala3@gmial.com
 */

import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
      };
    }
  }
}

export {};
