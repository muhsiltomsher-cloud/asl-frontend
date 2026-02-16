import { readFileSync } from "fs";
import { join } from "path";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      const envPath = join(process.cwd(), ".env");
      const envFile = readFileSync(envPath, "utf8");
      for (const line of envFile.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx === -1) continue;
        const key = trimmed.substring(0, eqIdx).trim();
        const val = trimmed.substring(eqIdx + 1).trim();
        if (key && !process.env[key]) {
          process.env[key] = val;
        }
      }
    } catch {
      // .env file not found — skip silently
    }
  }
}
