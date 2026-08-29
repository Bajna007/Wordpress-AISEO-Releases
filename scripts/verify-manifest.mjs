import {
  createHash,
  createPublicKey,
  timingSafeEqual,
  verify,
} from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));

function argument(name, fallback = "") {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 && process.argv[index + 1]
    ? process.argv[index + 1]
    : fallback;
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, canonicalize(value[key])]),
    );
  }
  return value;
}

const manifestPath = path.resolve(
  repositoryRoot,
  argument("manifest", "stable/manifest.json"),
);
const keyPath = path.join(repositoryRoot, "trusted-public-key.json");
const [manifestText, keyText] = await Promise.all([
  readFile(manifestPath, "utf8"),
  readFile(keyPath, "utf8"),
]);
const manifest = JSON.parse(manifestText);
const trust = JSON.parse(keyText);
const rawPublicKey = Buffer.from(trust.public_key_base64 ?? "", "base64");
const fingerprint = createHash("sha256").update(rawPublicKey).digest("hex");

if (
  trust.algorithm !== "Ed25519" ||
  rawPublicKey.length !== 32 ||
  trust.key_id !== `sha256:${fingerprint}` ||
  trust.provenance?.source_repository !== "Bajna007/Wordpress-AISEO" ||
  trust.provenance?.source_path !== "src/Updater/Updater.php"
) {
  throw new Error("Tracked public-key provenance is invalid.");
}

const versionPattern = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
const expectedPackageUrl = `https://github.com/Bajna007/Wordpress-AISEO-Releases/releases/download/v${manifest.version}/wordpress-aiseo-${manifest.version}.zip`;
if (
  manifest.schema_version !== "1.0.0" ||
  manifest.plugin !== "wordpress-aiseo" ||
  !versionPattern.test(manifest.version ?? "") ||
  !["stable", "beta", "edge"].includes(manifest.channel) ||
  path.basename(path.dirname(manifestPath)) !== manifest.channel ||
  manifest.asset?.name !== `wordpress-aiseo-${manifest.version}.zip` ||
  !Number.isSafeInteger(manifest.asset?.size) ||
  manifest.asset.size < 1 ||
  !/^[a-f0-9]{64}$/.test(manifest.asset?.sha256 ?? "") ||
  manifest.package_url !== expectedPackageUrl ||
  !/^[a-f0-9]{40}$/.test(manifest.release_commit ?? "")
) {
  throw new Error("Release manifest identity is invalid.");
}

const signature = Buffer.from(manifest.signature ?? "", "base64");
const unsigned = { ...manifest };
delete unsigned.signature;
const publicKey = createPublicKey({
  key: Buffer.concat([
    Buffer.from("302a300506032b6570032100", "hex"),
    rawPublicKey,
  ]),
  format: "der",
  type: "spki",
});
if (
  signature.length !== 64 ||
  !verify(
    null,
    Buffer.from(JSON.stringify(canonicalize(unsigned))),
    publicKey,
    signature,
  )
) {
  throw new Error("Release manifest signature is invalid.");
}

if (!process.argv.includes("--manifest-only")) {
  const response = await fetch(manifest.package_url, {
    headers: { "User-Agent": "AISEO-Release-Verifier" },
  });
  if (!response.ok) {
    throw new Error(`Release package download failed: ${response.status}`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  const digest = createHash("sha256").update(bytes).digest("hex");
  if (
    bytes.length !== manifest.asset.size ||
    !timingSafeEqual(
      Buffer.from(digest, "utf8"),
      Buffer.from(manifest.asset.sha256, "utf8"),
    )
  ) {
    throw new Error("Release package size or digest is invalid.");
  }
}

console.log(
  `verified-release|channel=${manifest.channel}|version=${manifest.version}|commit=${manifest.release_commit}|mode=${process.argv.includes("--manifest-only") ? "manifest" : "manifest+asset"}`,
);
