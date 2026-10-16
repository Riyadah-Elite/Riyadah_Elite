/**
 * @author aliasgarbootwala3@gmial.com
 */

import "./src/config/config.js";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    /*
     * Read straight from process.env instead of the typed `env()` helper so
     * that `prisma generate` keeps working in environments that only type-check
     * and never have a database URL (CI, Docker build stage). `database.ts`
     * fails loudly when DATABASE_URL is missing at runtime.
     */
    url: process.env.DATABASE_URL ?? "",
  },
});