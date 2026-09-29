# AISEO release distribution

This public repository holds signed WordPress packages/manifests and verification
only. Plugin source, signing implementation, keys, credentials and private runtime
or customer data stay in the private source/publisher environment.

Never hand-edit signed manifests or reconstruct a signer here. Release assets may
be created/replaced/deleted only for an explicitly requested release operation,
through the private publisher. Verify exact source commit, tag, version, byte size,
SHA-256 and Ed25519 signature; Git publication is not a signed release or live update.

`trusted-public-key.json` mirrors the publisher key embedded in private-source
`src/Updater/Updater.php`; it cannot change the WordPress trust set. Key rotation
requires private-source trust, protected publisher-key parity and an existing signed
release first. Signing stays DPAPI-protected on the trusted Windows publisher;
GitHub Actions is not the signing path and remains disabled.

Use `npm test` for relevant offline structure/signature checks. For changed release
metadata/assets or an actual release use `npm run verify:stable` to verify the
downloaded package as well; manifest-only success does not prove availability or
digest parity. Plain instructions need diff/reference review, not new publication.

Preserve active/dirty work, fetch before comparing refs, and fast-forward only a
clean expected checkout. Stage intended paths; no destructive reset/clean,
force-push or silent switching. Generic model/style/frontend rules do not belong
in this distribution repository. Report actual checks, material gaps and delivery;
no repeated audit chain or fabricated release verification.
