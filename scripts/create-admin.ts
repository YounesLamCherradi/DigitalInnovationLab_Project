import "dotenv/config";
import { pool } from "../server/database";
import { hashPassword } from "../server/auth";

const [emailArg, password] = process.argv.slice(2);
const email = emailArg?.trim().toLowerCase();
if (!email || !password || password.length < 8) {
  console.error("Usage: npm run create-admin -- admin@example.com 'password-at-least-8-chars'");
  process.exit(1);
}
await pool.query(
  "INSERT INTO admin_users (email, password_hash, role) VALUES ($1, $2, 'administrator') ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = 'administrator', updated_at = now()",
  [email, hashPassword(password)],
);
console.log(`Administrator ${email} is ready.`);
await pool.end();
