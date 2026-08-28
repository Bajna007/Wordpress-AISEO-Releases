# Release repository rules

- This public repository contains signed WordPress AISEO release manifests and release automation only. Keep plugin source, credentials, private signing keys, customer data, database exports, and local environment files out of it.
- Treat GitHub `main` as the synchronization authority. Fetch before comparing; update a clean workspace by fast-forward only. Never reset, clean, force-push, or overwrite an active/dirty workspace.
- Do not hand-edit a signed manifest or replace a release asset. Publish through the validated local command in the private source repository, then verify the tag, exact private-source commit, version, byte size, SHA-256 digest, and Ed25519 signature.
- Generic Caveman, Impeccable, and Emil skills are provided by the user's global agent layer. Do not vendor copies into this release repository; add a repository skill only for a genuinely release-specific workflow.
- GitHub Actions is intentionally not part of the signing path: the private key remains DPAPI-protected on the trusted Windows publisher. A Git push is not a release or a deployment; do not create, replace, or delete release assets unless the user explicitly requests that release operation.
