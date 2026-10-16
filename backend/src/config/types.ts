/**
 * @author aliasgarbootwala3@gmial.com
 */

export const TYPES = {
  // Controller Types
  AuthController: Symbol.for("AuthController"),

  // Service Types
  AuthService: Symbol.for("AuthService"),

  // Repository Types
  AuthRepository: Symbol.for("AuthRepository"),


  // Infrastructure Types
  Database: Symbol.for("Database"),
  PrismaClient: Symbol.for("PrismaClient"),
  Logger: Symbol.for("Logger"),
  ApiError: Symbol.for("ApiError"),
  StorageService: Symbol.for("StorageService"),  

  // middleware
  AuthMiddleware: Symbol.for("AuthMiddleware"),
  MulterMiddleware: Symbol.for("MulterMiddleware"),
};
