/**
 * @author aliasgarbootwala3@gmial.com
 */

import { Container } from "inversify";
import "reflect-metadata";
import { TYPES } from "./types.js";

// service
import AuthService from "../services/auth.service.js";
import FileService from "../services/file.service.js";
import CategoryService from "../services/category.service.js";
import ListingService from "../services/listing.service.js";
import JoinListingService from "../services/joinlisting.service.js";
import NotificationService from "../services/notification.service.js";
import ListingStatusService from "../services/listingstatus.service.js";
import BugReportService from "../services/bugreport.service.js";
import UserProgressService from "../services/userprogress.service.js";

// repository
import AuthRepository from "../repositories/auth.repository.js";
import FileRepository from "../repositories/file.repository.js";
import CategoryRepository from "../repositories/category.repository.js";
import ListingRepository from "../repositories/listing.repository.js";
import JoinListingRepository from "../repositories/joinlisting.repository.js";
import NotificationRepository from "../repositories/notification.repository.js";
import BugReportRepository from "../repositories/bugreport.repository.js";
import UserProgressRepository from "../repositories/userprogress.repository.js";

// infrastructure
import Logger from "../utils/logger.js";
import ApiError from "../utils/apiError.js";
import StorageService from "../utils/storage.js";
import PrismaDatabase from "./database.js";
import { setNotificationService } from "../utils/notification.js";


const container = new Container();

/*
 * Database bindings
 *
 * `Database` owns the client lifecycle (connect / disconnect). `PrismaClient`
 * hands that same instance to whoever needs to run queries, so repositories
 * depend on the client rather than on a driver.
 */
container.bind(TYPES.Database).to(PrismaDatabase).inSingletonScope();

/*
 * `Context` cannot be named here: inversify 6 ships no type entry for its
 * `exports` map, so `import { interfaces } from "inversify"` is untyped under
 * NodeNext and the shape is spelled out instead.
 */
interface ResolverContext {
  container: { get(identifier: symbol): unknown };
}

container
  .bind(TYPES.PrismaClient)
  .toDynamicValue((context: ResolverContext) =>
    (context.container.get(TYPES.Database) as PrismaDatabase).getClient(),
  )
  .inSingletonScope(); 

// Service bindings
container.bind(TYPES.AuthService).to(AuthService).inSingletonScope();
container.bind(TYPES.FileService).to(FileService).inSingletonScope();
container.bind(TYPES.CategoryService).to(CategoryService).inSingletonScope();
container.bind(TYPES.ListingService).to(ListingService).inSingletonScope();
container.bind(TYPES.JoinListingService).to(JoinListingService).inSingletonScope();
container.bind(TYPES.NotificationService).to(NotificationService).inSingletonScope();
container.bind(TYPES.ListingStatusService).to(ListingStatusService).inSingletonScope();
container.bind(TYPES.BugReportService).to(BugReportService).inSingletonScope();
container.bind(TYPES.UserProgressService).to(UserProgressService).inSingletonScope();

// Repository bindings
container.bind(TYPES.AuthRepository).to(AuthRepository).inSingletonScope();
container.bind(TYPES.FileRepository).to(FileRepository).inSingletonScope();
container.bind(TYPES.CategoryRepository).to(CategoryRepository).inSingletonScope();
container.bind(TYPES.ListingRepository).to(ListingRepository).inSingletonScope();
container.bind(TYPES.JoinListingRepository).to(JoinListingRepository).inSingletonScope();
container.bind(TYPES.NotificationRepository).to(NotificationRepository).inSingletonScope();
container.bind(TYPES.BugReportRepository).to(BugReportRepository).inSingletonScope();
container.bind(TYPES.UserProgressRepository).to(UserProgressRepository).inSingletonScope();

// Logger bindings
container.bind(TYPES.Logger).to(Logger).inSingletonScope();

// ApiError bindings
container.bind(TYPES.ApiError).to(ApiError).inSingletonScope();

// Storage bindings
container.bind(TYPES.StorageService).to(StorageService).inSingletonScope();

/*
 * Make the notification utility usable from plain functions/services without
 * importing the container (which would create a module cycle).
 */
setNotificationService(() =>
  container.get<NotificationService>(TYPES.NotificationService),
);

export default container;
