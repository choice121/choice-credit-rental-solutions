#!/usr/bin/env node
/**
 * Architecture Guard
 * Validates that the codebase has not drifted from the intended architecture.
 * Run manually: node scripts/check-architecture.mjs
 * Also runs automatically in CI via .github/workflows/architecture-guard.yml
 */

import { readFileSync, existsSync } from "fs";
import { execSync } from "child_process";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");

let passed = 0;
let failed = 0;
const errors = [];

function check(name, condition, message) {
  if (condition) {
    console.log(`  ✅  ${name}`);
    passed++;
  } else {
    console.error(`  ❌  ${name}`);
    console.error(`      ${message}`);
    failed++;
    errors.push({ name, message });
  }
}

function fileContains(filePath, pattern) {
  const abs = path.join(ROOT, filePath);
  if (!existsSync(abs)) return false;
  const content = readFileSync(abs, "utf8");
  return typeof pattern === "string" ? content.includes(pattern) : pattern.test(content);
}

function fileExists(filePath) {
  return existsSync(path.join(ROOT, filePath));
}

function grepFiles(pattern, extensions = ["ts", "tsx", "js", "mjs"]) {
  try {
    const ext = extensions.map((e) => `--include="*.${e}"`).join(" ");
    const result = execSync(
      `grep -r --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git ${ext} -l "${pattern}" "${ROOT}/artifacts" 2>/dev/null || true`,
      { encoding: "utf8" },
    );
    return result.trim().split("\n").filter(Boolean);
  } catch {
    return [];
  }
}

console.log("\n🏛️  Architecture Guard — Choice Credit and Rental Solutions\n");

// ── 1. Supabase client files must exist ─────────────────────────────────────
console.log("1. Supabase client files");
check(
  "Server Supabase client exists",
  fileExists("artifacts/api-server/src/lib/supabase.ts"),
  "artifacts/api-server/src/lib/supabase.ts has been deleted",
);
check(
  "Server Supabase client imports @supabase/supabase-js",
  fileContains("artifacts/api-server/src/lib/supabase.ts", "@supabase/supabase-js"),
  "Server Supabase client no longer uses @supabase/supabase-js",
);
check(
  "Frontend Supabase client exists",
  fileExists("artifacts/choice-credit/src/lib/supabase.ts"),
  "artifacts/choice-credit/src/lib/supabase.ts has been deleted",
);
check(
  "Frontend auth provider exists",
  fileExists("artifacts/choice-credit/src/lib/auth.tsx"),
  "artifacts/choice-credit/src/lib/auth.tsx has been deleted",
);
check(
  "Auth middleware uses Supabase",
  fileContains("artifacts/api-server/src/lib/auth-middleware.ts", "@supabase/supabase-js"),
  "Auth middleware no longer validates Supabase JWTs",
);

// ── 2. No forbidden packages in package.json files ───────────────────────────
console.log("\n2. Forbidden packages");
const forbiddenPackages = [
  "@replit/database",
  "@replit/object-storage",
  "@neondatabase/serverless",
  "better-auth",
  "@clerk/clerk-sdk-node",
  "@clerk/clerk-react",
  "next-auth",
  "firebase-admin",
  "firebase",
];

const packageFiles = [
  "package.json",
  "artifacts/api-server/package.json",
  "artifacts/choice-credit/package.json",
];

for (const pkg of forbiddenPackages) {
  const foundIn = packageFiles.filter((f) => fileContains(f, `"${pkg}"`));
  check(
    `"${pkg}" not installed`,
    foundIn.length === 0,
    `Forbidden package "${pkg}" found in: ${foundIn.join(", ")}`,
  );
}

// ── 3. No Replit Auth imports in source code ─────────────────────────────────
console.log("\n3. Replit-managed service imports in source");
const forbiddenImports = [
  "@replit/database",
  "@replit/object-storage",
  "replitAuth",
  "replit-auth",
];
for (const imp of forbiddenImports) {
  const files = grepFiles(imp);
  check(
    `No import of "${imp}"`,
    files.length === 0,
    `Found "${imp}" referenced in: ${files.join(", ")}`,
  );
}

// ── 4. SUPABASE_URL env var referenced in server ─────────────────────────────
console.log("\n4. Environment variable references");
check(
  "Server references SUPABASE_URL",
  fileContains("artifacts/api-server/src/lib/supabase.ts", "SUPABASE_URL"),
  "Server Supabase client no longer reads SUPABASE_URL",
);
check(
  "Server references SUPABASE_SERVICE_ROLE_KEY",
  fileContains("artifacts/api-server/src/lib/supabase.ts", "SUPABASE_SERVICE_ROLE_KEY"),
  "Server Supabase client no longer reads SUPABASE_SERVICE_ROLE_KEY",
);

// ── 5. No Supabase service role key exposed to frontend ──────────────────────
console.log("\n5. Secret exposure check");
const frontendSrc = path.join(ROOT, "artifacts/choice-credit/src");
const serviceKeyExposed = grepFiles("SERVICE_ROLE_KEY").filter((f) =>
  f.startsWith(frontendSrc),
);
check(
  "SUPABASE_SERVICE_ROLE_KEY not referenced in frontend",
  serviceKeyExposed.length === 0,
  `Service role key exposed in frontend files: ${serviceKeyExposed.join(", ")}`,
);

// ── 6. Architecture docs exist ───────────────────────────────────────────────
console.log("\n6. Architecture documentation");
check("ARCHITECTURE.md exists", fileExists("ARCHITECTURE.md"), "ARCHITECTURE.md has been deleted");
check("AGENTS.md exists", fileExists("AGENTS.md"), "AGENTS.md has been deleted");

// ── Summary ──────────────────────────────────────────────────────────────────
console.log(`\n${"─".repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  console.error("❌  Architecture violations detected. See errors above.");
  console.error("    Read ARCHITECTURE.md before making further changes.\n");
  process.exit(1);
} else {
  console.log("✅  All architecture checks passed.\n");
  process.exit(0);
}
