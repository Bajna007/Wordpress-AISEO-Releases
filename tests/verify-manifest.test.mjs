import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));

test("stable manifest verifies with tracked private-source public key", async () => {
  const result = spawnSync(
    process.execPath,
    ["scripts/verify-manifest.mjs", "--manifest", "stable/manifest.json", "--manifest-only"],
    { cwd: repositoryRoot, encoding: "utf8" },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /verified-release\|channel=stable\|version=0\.7\.30/);
});

test("public repository contains no signing implementation", async () => {
  await assert.rejects(
    access(path.join(repositoryRoot, "scripts", "sign-manifest.mjs")),
    { code: "ENOENT" },
  );
  const verifier = await readFile(
    path.join(repositoryRoot, "scripts", "verify-manifest.mjs"),
    "utf8",
  );
  assert.doesNotMatch(verifier, /PRIVATE_KEY|createPrivateKey|\bsign\s*\(/);
});
