/** @param {import('node-pg-migrate').MigrationBuilder} pgm */
exports.up = (pgm) => {
  // --- extensions
  pgm.sql('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

  // --- users
  pgm.createTable("users", {
    id: { type: "varchar(50)", primaryKey: true },
    username: { type: "text", notNull: true, unique: true },
    password: { type: "text", notNull: true },
    fullname: { type: "text", notNull: true },
  });

  // --- authentications (refresh tokens)
  pgm.createTable("authentications", {
    token: { type: "text", primaryKey: true },
  });

  // --- albums
  pgm.createTable("albums", {
    id: { type: "varchar(50)", primaryKey: true },
    name: { type: "text", notNull: true },
    year: { type: "integer", notNull: true },
  });

  // --- songs
  pgm.createTable("songs", {
    id: { type: "varchar(50)", primaryKey: true },
    title: { type: "text", notNull: true },
    year: { type: "integer", notNull: true },
    performer: { type: "text", notNull: true },
    genre: { type: "text" },
    duration: { type: "integer" },
    album_id: {
      type: "varchar(50)",
      references: '"albums"(id)',
      onDelete: "SET NULL",
    },
  });
  // checks (opsional tapi bagus)
  pgm.addConstraint("songs", "songs_year_check", {
    check: "year BETWEEN 1900 AND 9999",
  });
  pgm.addConstraint("songs", "songs_duration_check", {
    check: "duration IS NULL OR duration >= 0",
  });
  // indexes untuk pencarian
  pgm.sql(
    "CREATE INDEX IF NOT EXISTS songs_title_idx ON songs (LOWER(title));"
  );
  pgm.sql(
    "CREATE INDEX IF NOT EXISTS songs_performer_idx ON songs (LOWER(performer));"
  );

  // --- playlists
  pgm.createTable("playlists", {
    id: { type: "varchar(50)", primaryKey: true },
    name: { type: "text", notNull: true },
    owner: {
      type: "varchar(50)",
      notNull: true,
      references: '"users"(id)',
      onDelete: "CASCADE",
    },
  });

  // --- playlist_songs
  pgm.createTable("playlist_songs", {
    id: { type: "varchar(50)", primaryKey: true },
    playlist_id: {
      type: "varchar(50)",
      notNull: true,
      references: '"playlists"(id)',
      onDelete: "CASCADE",
    },
    song_id: {
      type: "varchar(50)",
      notNull: true,
      references: '"songs"(id)',
      onDelete: "CASCADE",
    },
  });
  // cegah duplikasi lagu di playlist
  pgm.addConstraint("playlist_songs", "playlist_songs_unique", {
    unique: ["playlist_id", "song_id"],
  });
  // index akses cepat
  pgm.sql(
    "CREATE INDEX IF NOT EXISTS playlist_songs_playlist_idx ON playlist_songs (playlist_id);"
  );

  // --- collaborations (opsional)
  pgm.createTable("collaborations", {
    id: { type: "varchar(50)", primaryKey: true },
    playlist_id: {
      type: "varchar(50)",
      notNull: true,
      references: '"playlists"(id)',
      onDelete: "CASCADE",
    },
    user_id: {
      type: "varchar(50)",
      notNull: true,
      references: '"users"(id)',
      onDelete: "CASCADE",
    },
  });
  pgm.addConstraint("collaborations", "collaborations_playlist_user_unique", {
    unique: ["playlist_id", "user_id"],
  });

  // --- playlist_song_activities (opsional)
  pgm.createTable("playlist_song_activities", {
    id: { type: "varchar(50)", primaryKey: true },
    playlist_id: {
      type: "varchar(50)",
      notNull: true,
      references: '"playlists"(id)',
      onDelete: "CASCADE",
    },
    song_id: {
      type: "varchar(50)",
      notNull: true,
      references: '"songs"(id)',
      onDelete: "CASCADE",
    },
    user_id: {
      type: "varchar(50)",
      notNull: true,
      references: '"users"(id)',
      onDelete: "CASCADE",
    },
    action: { type: "text", notNull: true },
    time: { type: "timestamptz", notNull: true, default: pgm.func("NOW()") },
  });
  pgm.addConstraint(
    "playlist_song_activities",
    "playlist_song_activities_action_check",
    {
      check: "action IN ('add','delete')",
    }
  );
};

/** @param {import('node-pg-migrate').MigrationBuilder} pgm */
exports.down = (pgm) => {
  // drop in reverse order (constraints first)
  pgm.dropConstraint(
    "playlist_song_activities",
    "playlist_song_activities_action_check"
  );
  pgm.dropTable("playlist_song_activities");

  pgm.dropConstraint("collaborations", "collaborations_playlist_user_unique");
  pgm.dropTable("collaborations");

  pgm.sql("DROP INDEX IF EXISTS playlist_songs_playlist_idx;");
  pgm.dropConstraint("playlist_songs", "playlist_songs_unique");
  pgm.dropTable("playlist_songs");

  pgm.dropTable("playlists");

  pgm.sql("DROP INDEX IF EXISTS songs_performer_idx;");
  pgm.sql("DROP INDEX IF EXISTS songs_title_idx;");
  pgm.dropConstraint("songs", "songs_duration_check");
  pgm.dropConstraint("songs", "songs_year_check");
  pgm.dropTable("songs");

  pgm.dropTable("albums");
  pgm.dropTable("authentications");
  pgm.dropTable("users");
};
