CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- users
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  fullname TEXT NOT NULL
);

-- authentications (refresh tokens)
CREATE TABLE IF NOT EXISTS authentications (
  token TEXT PRIMARY KEY
);

-- albums
CREATE TABLE IF NOT EXISTS albums (
  id VARCHAR(50) PRIMARY KEY,
  name TEXT NOT NULL,
  year INT NOT NULL
);

-- songs
CREATE TABLE IF NOT EXISTS songs (
  id VARCHAR(50) PRIMARY KEY,
  title TEXT NOT NULL,
  year INT NOT NULL,
  performer TEXT NOT NULL,
  genre TEXT,
  duration INT,
  album_id VARCHAR(50),
  CONSTRAINT fk_songs_album FOREIGN KEY (album_id)
    REFERENCES albums(id) ON DELETE SET NULL
);

-- playlists
CREATE TABLE IF NOT EXISTS playlists (
  id VARCHAR(50) PRIMARY KEY,
  name TEXT NOT NULL,
  owner VARCHAR(50) NOT NULL,
  CONSTRAINT fk_playlists_owner FOREIGN KEY (owner)
    REFERENCES users(id) ON DELETE CASCADE
);

-- playlist_songs
CREATE TABLE IF NOT EXISTS playlist_songs (
  id VARCHAR(50) PRIMARY KEY,
  playlist_id VARCHAR(50) NOT NULL,
  song_id VARCHAR(50) NOT NULL,
  CONSTRAINT fk_ps_playlist FOREIGN KEY (playlist_id)
    REFERENCES playlists(id) ON DELETE CASCADE,
  CONSTRAINT fk_ps_song FOREIGN KEY (song_id)
    REFERENCES songs(id) ON DELETE CASCADE
);

-- collaborations (opsional 1)
CREATE TABLE IF NOT EXISTS collaborations (
  id VARCHAR(50) PRIMARY KEY,
  playlist_id VARCHAR(50) NOT NULL,
  user_id VARCHAR(50) NOT NULL,
  CONSTRAINT fk_col_playlist FOREIGN KEY (playlist_id)
    REFERENCES playlists(id) ON DELETE CASCADE,
  CONSTRAINT fk_col_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT uniq_collab UNIQUE (playlist_id, user_id)
);

-- playlist_song_activities (opsional 2)
CREATE TABLE IF NOT EXISTS playlist_song_activities (
  id VARCHAR(50) PRIMARY KEY,
  playlist_id VARCHAR(50) NOT NULL,
  song_id VARCHAR(50) NOT NULL,
  user_id VARCHAR(50) NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('add', 'delete')),
  time TIMESTAMPTZ NOT NULL,
  CONSTRAINT fk_act_playlist FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
  CONSTRAINT fk_act_song FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
  CONSTRAINT fk_act_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
