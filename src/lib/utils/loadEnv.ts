import * as fs from "fs";
import * as path from "path";

let envLoaded = false;

/**
 * Load environment variables from Hostinger's .builds/config/.env file
 * This is needed because Hostinger stores env vars in a separate location
 * that isn't automatically loaded by the Node.js process
 */
export function loadHostingerEnv(): void {
  if (envLoaded) {
    return;
  }

  // Possible locations for the .env file on Hostinger
  const possiblePaths = [
    // Hostinger's config location (relative to public_html)
    path.join(process.cwd(), ".builds", "config", ".env"),
    // Alternative: one level up from public_html
    path.join(process.cwd(), "..", ".builds", "config", ".env"),
    // Standard .env in project root
    path.join(process.cwd(), ".env"),
    // .env.local in project root
    path.join(process.cwd(), ".env.local"),
  ];

  for (const envPath of possiblePaths) {
    try {
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, "utf-8");
        const lines = envContent.split("\n");

        for (const line of lines) {
          // Skip empty lines and comments
          const trimmedLine = line.trim();
          if (!trimmedLine || trimmedLine.startsWith("#")) {
            continue;
          }

          // Parse KEY=VALUE or KEY='VALUE' or KEY="VALUE"
          const match = trimmedLine.match(/^([^=]+)=(.*)$/);
          if (match) {
            const key = match[1].trim();
            let value = match[2].trim();

            // Remove surrounding quotes if present
            if (
              (value.startsWith("'") && value.endsWith("'")) ||
              (value.startsWith('"') && value.endsWith('"'))
            ) {
              value = value.slice(1, -1);
            }

            // Only set if not already defined in process.env
            if (!process.env[key]) {
              process.env[key] = value;
            }
          }
        }

        envLoaded = true;
        console.log(`[loadEnv] Loaded environment variables from: ${envPath}`);
        return;
      }
    } catch (error) {
      // Continue to next path if this one fails
      console.error(`[loadEnv] Error reading ${envPath}:`, error);
    }
  }

  // If we get here, no .env file was found
  console.warn("[loadEnv] No .env file found in any expected location");
}

/**
 * Get an environment variable, loading from Hostinger's config if needed
 */
export function getEnvVar(key: string): string | undefined {
  // First try to get from process.env
  if (process.env[key]) {
    return process.env[key];
  }

  // If not found, try loading from Hostinger's config
  loadHostingerEnv();

  return process.env[key];
}
