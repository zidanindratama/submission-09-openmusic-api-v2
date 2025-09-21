/** @param {import('node-pg-migrate').MigrationBuilder} pgm */
exports.up = (pgm) => {
  pgm.sql('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

  pgm.createTable("users", {
    id: { type: "varchar(50)", primaryKey: true },
    username: { type: "text", notNull: true, unique: true },
    password: { type: "text", notNull: true },
    fullname: { type: "text", notNull: true },
  });

  pgm.createTable("authentications", {
    token: { type: "text", primaryKey: true },
  });

  pgm.createTable("albums", {
    id: { type: "varchar(50)", primaryKey: true },
    name: { type: "text", notNull: true },
    year: { type: "integer", notNull: true },
  });

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
    time: { type: "timestamptz", notNull: true },
  });
  pgm.addConstraint(
    "playlist_song_activities",
    "playlist_song_activities_action_check",
    { check: "action IN ('add','delete')" }
  );
};

/** @param {import('node-pg-migrate').MigrationBuilder} pgm */
exports.down = (pgm) => {
  pgm.dropConstraint(
    "playlist_song_activities",
    "playlist_song_activities_action_check"
  );
  pgm.dropTable("playlist_song_activities");

  pgm.dropConstraint("collaborations", "collaborations_playlist_user_unique");
  pgm.dropTable("collaborations");

  pgm.dropTable("playlist_songs");
  pgm.dropTable("playlists");
  pgm.dropTable("songs");
  pgm.dropTable("albums");
  pgm.dropTable("authentications");
  pgm.dropTable("users");
};
