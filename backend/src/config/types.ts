/**
 * @author aliasgarbootwala3@gmial.com
 */

export const TYPES = {
  // Controller Types
  AuthController: Symbol.for("AuthController"),
  FileController: Symbol.for("FileController"),
  CategoryController: Symbol.for("CategoryController"),
  ListingController: Symbol.for("ListingController"),
  JoinListingController: Symbol.for("JoinListingController"),

  // Service Types
  AuthService: Symbol.for("AuthService"),
  FileService: Symbol.for("FileService"),
  CategoryService: Symbol.for("CategoryService"),
  ListingService: Symbol.for("ListingService"),
  JoinListingService: Symbol.for("JoinListingService"),
  NotificationService: Symbol.for("NotificationService"),

  // Repository Types
  AuthRepository: Symbol.for("AuthRepository"),
  FileRepository: Symbol.for("FileRepository"),
  CategoryRepository: Symbol.for("CategoryRepository"),
  ListingRepository: Symbol.for("ListingRepository"),
  JoinListingRepository: Symbol.for("JoinListingRepository"),
  NotificationRepository: Symbol.for("NotificationRepository"),


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
