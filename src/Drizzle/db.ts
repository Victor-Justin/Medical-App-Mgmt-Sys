import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from "./schema";

import * as dotenv from "dotenv";
dotenv.config();

const sql = neon(process.env.Database_URL!);

const db = drizzle(sql, { schema, logger: true });
export default db;
