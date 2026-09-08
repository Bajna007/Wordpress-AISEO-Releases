# Release repository rules

## Execution contract

- Finish the authorized result, reuse existing approval and honor narrower user scope. Resolve routine details; identify the exact rule when a real blocker needs user input.
- Read relevant context only. Keep a compact checkpoint for long work; historical documents are evidence rather than current instructions.
- Keep model/provider settings user-selected. Optional shared `instructions/models/gpt-6-astra.md` tunes Astra; this repository remains usable with other models.
- Use focused repository checks and stop retesting when sufficient evidence passes. Keep Actions disabled; distinguish local proof, enforced merge rules and actual delivery.

- This public repository contains signed WordPress AISEO release manifests and verification-only tooling. Signing and publication exist only in the private source repository. Keep plugin source, signing implementations, credentials, private keys, customer data, database exports, and local environment files out of it.
- Treat GitHub `main` as the synchronization authority. Fetch before comparing; update a clean workspace by fast-forward only. Never reset, clean, force-push, or overwrite an active/dirty workspace.
- Do not hand-edit a signed manifest or replace a release asset. Publish through the validated local command in the private source repository, then verify the tag, exact private-source commit, version, byte size, SHA-256 digest, and Ed25519 signature.
- `trusted-public-key.json` mirrors the active publisher public key already embedded in private-source `src/Updater/Updater.php`; it is not authority for changing the WordPress trust set. Never add or rotate a key here before private-source trust, protected publisher-key parity, and an existing signed release prove it.
- Run `npm test` for offline structure/signature checks and `npm run verify:stable` to download and verify the public stable asset. A passing manifest-only check does not prove package availability or digest parity.
- Generic Caveman, Impeccable, and Emil skills are provided by the user's global agent layer. Do not vendor copies into this release repository; add a repository skill only for a genuinely release-specific workflow.
- GitHub Actions is intentionally not part of the signing path: the private key remains DPAPI-protected on the trusted Windows publisher. A Git push is not a release or a deployment; do not create, replace, or delete release assets unless the user explicitly requests that release operation. Never reconstruct a signer in this public repository.
