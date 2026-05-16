import { pool } from './client.js';

// Yandex Games multi-platform migration.
//
// The original schema has `telegram_id BIGINT UNIQUE NOT NULL` on `users`.
// To accommodate Yandex Games players (which have a string UUID and no
// Telegram id), we:
//   1. Drop the NOT NULL constraint on `telegram_id` so Yandex-only rows
//      can exist.
//   2. Add a nullable `yandex_id` text column with a unique constraint.
//   3. Add a `platform` discriminator column so the application layer can
//      cheaply tell where a user came from.
//   4. Enforce that every row has at least one of (telegram_id, yandex_id).
//
// All statements are idempotent; running the migration twice is safe.

const migrations = [
  `ALTER TABLE users ALTER COLUMN telegram_id DROP NOT NULL`,

  `ALTER TABLE users ADD COLUMN IF NOT EXISTS yandex_id VARCHAR(128)`,

  `CREATE UNIQUE INDEX IF NOT EXISTS idx_users_yandex_id ON users(yandex_id) WHERE yandex_id IS NOT NULL`,

  `ALTER TABLE users ADD COLUMN IF NOT EXISTS platform VARCHAR(16) NOT NULL DEFAULT 'telegram'`,

  // Backfill platform for any rows that already have a yandex_id but were
  // inserted before this migration ran.
  `UPDATE users SET platform = 'yandex' WHERE yandex_id IS NOT NULL AND platform <> 'yandex'`,

  // Enforce: every user must have at least one platform identifier.
  // Using DO block to make the constraint creation idempotent (Postgres
  // has no IF NOT EXISTS for ALTER TABLE ADD CONSTRAINT before pg 16).
  `DO $$
   BEGIN
     IF NOT EXISTS (
       SELECT 1 FROM pg_constraint WHERE conname = 'users_one_platform_id'
     ) THEN
       ALTER TABLE users
         ADD CONSTRAINT users_one_platform_id
         CHECK (telegram_id IS NOT NULL OR yandex_id IS NOT NULL);
     END IF;
   END$$`,

  // Per-lobby "no betting" flag. Yandex Games lobbies are created with
  // no_bet=true so the in-round BettingManager flow is bypassed and the
  // game-end payout is a fixed pip reward to the winner(s).
  `ALTER TABLE lobbies ADD COLUMN IF NOT EXISTS no_bet BOOLEAN NOT NULL DEFAULT FALSE`,

  // Player progression / matchmaking stats. Used by the Yandex Games build
  // to power the quick-play matchmaking queue (level-banded matching) and
  // the profile widget on the multiplayer home screen. Columns are
  // cross-platform so the Telegram path stays compatible — Telegram simply
  // doesn't surface them in its UI today. All defaults are zero so no
  // existing row is invalidated.
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS xp           INTEGER NOT NULL DEFAULT 0`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS level        INTEGER NOT NULL DEFAULT 1`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS games_played INTEGER NOT NULL DEFAULT 0`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS wins         INTEGER NOT NULL DEFAULT 0`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS losses       INTEGER NOT NULL DEFAULT 0`,
  // Index by level so the in-memory matchmaking service can fetch a
  // candidate band cheaply when it needs to backfill on cold start.
  `CREATE INDEX IF NOT EXISTS idx_users_level ON users(level)`,
];

async function migrate() {
  console.log('Running Yandex Games multi-platform migrations...');

  for (const sql of migrations) {
    const preview = sql.replace(/\s+/g, ' ').substring(0, 80);
    try {
      await pool.query(sql);
      console.log('✓', preview + '...');
    } catch (err) {
      console.error('✗ Migration failed:', preview);
      console.error(err);
      process.exit(1);
    }
  }

  console.log('\n✓ Yandex Games migrations completed!');
  await pool.end();
}

migrate();
