import "dotenv/config";
import { mkdir, readdir, rm, stat, chmod } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const backupRoot = path.resolve(process.env.BACKUP_DIR || path.join(root, "backups"));
const retentionDays = Number(process.env.BACKUP_RETENTION_DAYS || 14);
const database = process.env.POSTGRES_DB || "digital_innovation_lab";
const user = process.env.POSTGRES_USER || "dil";
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const destination = path.join(backupRoot, stamp);

await mkdir(destination, { recursive: true, mode: 0o700 });
await chmod(destination, 0o700);

function streamCommand(command, args, outputPath) {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(outputPath, { mode: 0o600 });
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
    let error = "";
    child.stderr.on("data", (chunk) => { error += chunk; });
    child.stdout.pipe(output);
    child.on("error", reject);
    child.on("close", (code) => code === 0 ? resolve() : reject(new Error(error || `${command} exited with ${code}`)));
  });
}

try {
  await streamCommand("docker", ["compose", "exec", "-T", "db", "pg_dump", "-U", user, "-d", database, "--format=custom", "--no-owner", "--no-privileges"], path.join(destination, "database.dump"));
  await streamCommand("docker", ["compose", "exec", "-T", "app", "tar", "-czf", "-", "-C", "/app", "uploads", "private"], path.join(destination, "media.tar.gz"));
  await chmod(path.join(destination, "media.tar.gz"), 0o600);

  const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
  for (const entry of await readdir(backupRoot, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === stamp) continue;
    const target = path.join(backupRoot, entry.name);
    if ((await stat(target)).mtimeMs < cutoff) await rm(target, { recursive: true });
  }
  console.log(`Backup completed: ${destination}`);
} catch (error) {
  await rm(destination, { recursive: true, force: true });
  throw error;
}
