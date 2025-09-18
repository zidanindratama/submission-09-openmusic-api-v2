export const mapAlbum = ({ id, name, year }) => ({ id, name, year });

export const mapSong = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}) => ({ id, title, year, performer, genre, duration, albumId: album_id });
