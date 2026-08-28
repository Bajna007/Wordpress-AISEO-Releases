# WordPress AISEO releases

Public, signed plugin packages and channel manifests. No source code or credentials are published here.

Installed AISEO sites read `stable/manifest.json`, `beta/manifest.json`, or `edge/manifest.json`. Every manifest is Ed25519-signed and contains the exact ZIP SHA-256 digest.

Treat channel manifests as generated signed data. Publication runs from the private source repository on the trusted Windows publisher; GitHub Actions is intentionally not part of the signing path. The publication command re-downloads and verifies the release tag, exact private-source commit, signature, size, and digest instead of relying on a hand-edited manifest.
