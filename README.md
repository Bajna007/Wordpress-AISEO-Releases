# WordPress AISEO releases

Public, signed plugin packages, channel manifests, and verification-only tooling. No plugin source, signing implementation, private key, or credentials are published here.

The currently published repository tracks `stable/manifest.json`. Beta or edge directories appear only when the private publisher creates those channels. Every published manifest is Ed25519-signed and contains the exact ZIP size and SHA-256 digest. The manifest plus its matching immutable GitHub release asset define published channel state; a source-repository commit or tag alone does not.

## Requirements and layout

- Node.js 24 or newer; verification uses only Node built-ins and the global
  `fetch` implementation.
- `stable/manifest.json`: generated signed stable-channel metadata.
- `trusted-public-key.json`: verification copy of a public key already trusted
  by the private-source updater.
- `scripts/verify-manifest.mjs`: manifest/signature and optional asset verifier.
- `tests/verify-manifest.test.mjs`: offline identity, signature, and
  no-signer boundary tests.

Treat channel manifests as generated signed data. Publication runs from the private source repository on the trusted Windows publisher; GitHub Actions is intentionally not part of the signing path. The publication command re-downloads and verifies the release tag, exact private-source commit, signature, size, and digest instead of relying on a hand-edited manifest.

Verify tracked metadata without downloading the package or using network
access:

```powershell
npm test
```

Verify the tracked stable manifest and download its public ZIP to check exact
size and SHA-256 parity:

```powershell
npm run verify:stable
```

`npm test` does not prove package availability. `npm run verify:stable` does.

`trusted-public-key.json` is not authority for changing WordPress trust. Key
rotation starts in private source and the protected publisher, then requires an
existing signed-release proof before this mirror changes. This repository never
creates a trust root or signer.
