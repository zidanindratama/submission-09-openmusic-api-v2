import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import "dotenv/config";

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const pool = new Pool();
  const sql = fs.readFileSync(path.join(__dirname, "001_init.sql"), "utf8");
  await pool.query(sql);
  await pool.end();
  console.log("Database initialized ✅");
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
