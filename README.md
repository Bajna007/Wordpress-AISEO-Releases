# WordPress AISEO releases

Public, signed plugin packages, channel manifests, and verification-only tooling. No plugin source, signing implementation, private key, or credentials are published here.

The currently published repository tracks `stable/manifest.json`. Beta or edge directories appear only when the private publisher creates those channels. Every published manifest is Ed25519-signed and contains the exact ZIP SHA-256 digest.

Treat channel manifests as generated signed data. Publication runs from the private source repository on the trusted Windows publisher; GitHub Actions is intentionally not part of the signing path. The publication command re-downloads and verifies the release tag, exact private-source commit, signature, size, and digest instead of relying on a hand-edited manifest.

Verify tracked metadata without downloading the package:

```powershell
npm test
```

Verify the public stable manifest and downloaded ZIP together:

```powershell
npm run verify:stable
```

`trusted-public-key.json` is a verification copy of the active public key already embedded in the private source updater. Key rotation starts in private source and the protected publisher; this repository never creates a trust root.
