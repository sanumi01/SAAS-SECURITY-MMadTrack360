# Server README

- **CI Badge**: ![Node.js Tests](https://github.com/sanumi01/SAAS-SECURITY-MMadTrack360/actions/workflows/nodejs-tests.yml/badge.svg)

This folder contains the Express-based server used by the project. This README documents DB persistence configuration, developer flags, and how to run the test harness.

- **Run tests**: `cd server; npm test`

Environment variables (server):

- `DB_PERSIST_DEBOUNCE_MS`: Number (ms). Debounce window for JSON fallback writes. Default: `250`.
  - When the JSON-file fallback is used (no SQLite available), writes are batched with this debounce.

- `DB_PERSIST_PERIODIC_FLUSH_MS`: Number (ms). Optional periodic flush interval. Default: `0` (disabled).
  - When >0, the server will flush the JSON DB to disk at least every this many milliseconds to reduce the window of in-memory-only changes.
  - Example: `DB_PERSIST_PERIODIC_FLUSH_MS=5000` flushes every 5s.

- `DEV_RETURN_RESET_TOKEN`: Set to `1` to make password reset tokens appear in responses during tests/dev runs. Default: unset/disabled.

- `BCRYPT_ROUNDS`: Number. Cost parameter for bcrypt hashing. Default: `10`.

Notes:
- The server tries to use SQLite (`better-sqlite3`). If that fails to load (for example in some developer environments), a JSON-file fallback is used at `server/data/db.json`.
- The JSON fallback now uses an async debounced writer and exposes `db.persist()` and `db.flush()` in the runtime. A periodic flush can be enabled with `DB_PERSIST_PERIODIC_FLUSH_MS` for environments where you want more frequent disk durability.

CI:
- A GitHub Actions workflow (`.github/workflows/nodejs-tests.yml`) runs `npm test` for the `server` folder on push and pull requests. The badge above points to that workflow's status for the repository branch.

If you want me to also add a short section to the repository root `README.md` linking to this file and adding the same badge there, tell me and I'll update it.