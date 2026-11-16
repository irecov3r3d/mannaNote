// Resolve the "@/..." path alias (tsconfig paths -> src/) for node --test runs
// of TypeScript sources under --experimental-strip-types.
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const SRC = fileURLToPath(new URL("../src/", import.meta.url));
const CANDIDATES = ["", ".ts", ".tsx", "/index.ts", "/index.tsx"];

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      const base = SRC + specifier.slice(2);
      for (const ext of CANDIDATES) {
        const file = base + ext;
        if (ext === "" ? /\.(m?[jt]sx?)$/.test(file) && existsSync(file) : existsSync(file)) {
          return nextResolve(pathToFileURL(file).href, context);
        }
      }
    }
    return nextResolve(specifier, context);
  },
});
