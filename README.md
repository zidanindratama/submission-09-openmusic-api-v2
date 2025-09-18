# 🎵 OpenMusic API v2 (Hapi + PostgreSQL)

Proyek ini adalah **RESTful API** untuk mengelola **album**, **lagu**, serta fitur **playlist** (private) dengan **autentikasi JWT**.
Dibangun menggunakan **Node.js (ESM)**, **Hapi**, dan **PostgreSQL**.
API disusun mengikuti kriteria submission **OpenMusic V2** (Registrasi & Auth, Playlist restrict, Foreign Key, Data Validation, Error Handling) + opsi **Kolaborasi** dan **Playlist Activities**.

---

## ⚙️ Environment Variables

Buat file `.env` di root proyek:

```ini
# Server
HOST=0.0.0.0
PORT=5000

# PostgreSQL
PGHOST=localhost
PGPORT=5432
PGDATABASE=openmusicv2
PGUSER=postgres
PGPASSWORD=yourpassword

# JWT
ACCESS_TOKEN_KEY=supersecretaccesstoken
REFRESH_TOKEN_KEY=supersecretrefreshtoken
ACCESS_TOKEN_AGE=3600
```

> **Catatan**
>
> - Pastikan database `openmusicv2` sudah ada:
>
>   ```sql
>   CREATE DATABASE openmusicv2;
>   ```
>
> - `ACCESS_TOKEN_KEY` dan `REFRESH_TOKEN_KEY` **wajib** diisi & konsisten (digunakan untuk sign access/refresh token).

---

## ✨ Fitur Utama

- **Kriteria 1 – Registrasi & Autentikasi**

  - `POST /users` — registrasi (username unik).
  - `POST /authentications` — login, mengembalikan **accessToken** & **refreshToken**.
  - `PUT /authentications` — refresh **accessToken** menggunakan **refreshToken**.
  - `DELETE /authentications` — logout, hapus **refreshToken** dari DB.
  - Format token: **JWT** berisi payload `{ userId }`.

- **Kriteria 2 – Playlist (Restricted)**

  - `POST /playlists`, `GET /playlists`, `DELETE /playlists/{id}`.
  - `POST /playlists/{id}/songs`, `GET /playlists/{id}/songs`, `DELETE /playlists/{id}/songs`.
  - Hanya **pemilik** (atau **kolaborator**) yang bisa mengelola playlist.
  - Response sesuai spesifikasi (lihat contoh di bawah).

- **Kriteria 3 – Foreign Key**

  - Relasi: `songs → albums`, `playlists → users`, `playlist_songs → (playlists, songs)`, dll.

- **Kriteria 4 – Data Validation (Joi)**

  - Validasi payload untuk Users, Authentications, Playlists, Playlist-Songs, Albums, Songs.

- **Kriteria 5 – Error Handling**

  - `400 Bad Request` → payload invalid.
  - `401 Unauthorized` → tanpa access token pada resource restricted.
  - `403 Forbidden` → akses bukan miliknya.
  - `404 Not Found` → resource tak ditemukan.
  - `500 Internal Server Error` → error server.
  - Penanganan terpusat via **onPreResponse**.

- **Kriteria 6 – Pertahankan V1**

  - CRUD **Albums** & **Songs** (public).
  - `GET /songs?title=...&performer=...` (query filter).
  - Detail album menampilkan daftar lagu di album.

- **Kriteria Opsional**

  - **Kolaborasi**: `POST/DELETE /collaborations` → tambah/hapus kolaborator playlist.
  - **Playlist Activities**: `GET /playlists/{id}/activities` → riwayat tambah/hapus lagu di playlist.

---

## 📂 Struktur Proyek

```
submission-09-openmusic-api-v2/
├─ .env.example
├─ .eslintrc.cjs
├─ src/
│  ├─ server.js
│  ├─ container.js
│  ├─ exceptions/
│  │   ├─ ClientError.js
│  │   ├─ InvariantError.js
│  │   ├─ AuthenticationError.js
│  │   ├─ AuthorizationError.js
│  │   └─ NotFoundError.js
│  ├─ tokenize/TokenManager.js
│  ├─ utils/mapDBToModel.js
│  ├─ api/
│  │   ├─ albums/ (public)
│  │   ├─ songs/  (public)
│  │   ├─ users/  (public)
│  │   ├─ authentications/ (public)
│  │   ├─ playlists/ (auth: openmusic_jwt)
│  │   ├─ collaborations/ (auth: openmusic_jwt)   # opsional
│  │   └─ activities/    (auth: openmusic_jwt)   # opsional
│  ├─ services/postgres/
│  └─ validator/
├─ sql/
│  ├─ 001_init.sql
│  └─ run.js
└─ package.json
```

> **Catatan**: Endpoint **albums** dan **songs** sengaja dibuat **public** (`auth:false`) karena pengujian mengaksesnya tanpa token.

---

## 🧰 Teknologi

- **Node.js** (LTS ≥ 18)
- **@hapi/hapi**, **@hapi/jwt**
- **pg** (PostgreSQL)
- **Joi** (validasi)
- **dotenv**, **auto-bind**
- **ESLint (standard)**, **nodemon**

---

## ▶️ Cara Menjalankan

1. **Install dependency**

   ```bash
   npm install
   ```

2. **Setup database**

   - Buat DB `openmusicv2`.
   - Salin `.env.example` → `.env`, sesuaikan kredensial.

3. **Init schema**

   ```bash
   npm run db:setup
   ```

   (menjalankan `sql/001_init.sql`)

4. **Development (auto-reload)**

   ```bash
   npm run dev
   # http://localhost:5000
   ```

5. **Production**

   ```bash
   npm start
   ```

> **Scripts** (dari `package.json`):
>
> - `dev` → nodemon `src/server.js`
> - `start` → node `src/server.js`
> - `db:setup` → jalankan migrasi SQL sederhana
> - `lint` → ESLint (standard)

---

## 🔐 Autentikasi

- **Login**

  - `POST /authentications`
  - Body: `{ "username": "dicoding", "password": "secret" }`
  - `201` → `{ "status":"success", "data": { "accessToken":"...", "refreshToken":"..." } }`

- **Gunakan Access Token**

  - Header: `Authorization: Bearer <accessToken>`
  - Diperlukan untuk semua endpoint **/playlists**, **/collaborations**, **/playlists/{id}/activities**.

- **Refresh Token**

  - `PUT /authentications` → body `{ "refreshToken": "..." }`
  - `200` → `{ "status":"success", "data": { "accessToken":"..." } }`

- **Logout**

  - `DELETE /authentications` → hapus refresh token dari DB.

---

## 📡 Contoh Respons Penting

### GET /playlists

```json
{
  "status": "success",
  "data": {
    "playlists": [
      {
        "id": "playlist-123",
        "name": "Lagu Indie Hits Indonesia",
        "username": "dicoding"
      }
    ]
  }
}
```

### GET /playlists/{id}/songs

```json
{
  "status": "success",
  "data": {
    "playlist": {
      "id": "playlist-xyz",
      "name": "My Favorite Coldplay",
      "username": "dicoding",
      "songs": [
        {
          "id": "song-1",
          "title": "Life in Technicolor",
          "performer": "Coldplay"
        }
      ]
    }
  }
}
```

### GET /playlists/{id}/activities _(opsional)_

```json
{
  "status": "success",
  "data": {
    "playlistId": "playlist-xyz",
    "activities": [
      {
        "username": "dicoding",
        "title": "Life in Technicolor",
        "action": "add",
        "time": "2021-09-13T08:06:20.600Z"
      }
    ]
  }
}
```

---

## 🧪 Pengujian dengan Postman

1. Import **collection** dan **environment** Postman (V2) ke aplikasi Postman.
2. Set `{{port}} = 5000` (atau sesuai `.env`).
3. Jalankan folder secara **berurutan**:

   1. **Users** → 2) **Authentications** → 3) **Albums** → 4) **Songs** → 5) **Playlists** → (opsional) **Collaborations** & **Activities**.

4. Jika terjadi kegagalan karena data “kotor”, kosongkan tabel:

   ```sql
   TRUNCATE albums, songs, users, authentications, playlists, playlist_songs, playlist_song_activities, collaborations RESTART IDENTITY CASCADE;
   ```

---

## 🐛 Error Handling (Ringkas)

| Kondisi                                 | Kode | Body                                    |
| --------------------------------------- | ---- | --------------------------------------- |
| Payload tidak valid                     | 400  | `{ "status":"fail", "message":"..." }`  |
| Token hilang/invalid (akses restricted) | 401  | `{ "status":"fail", "message":"..." }`  |
| Akses bukan milik/kolaborator           | 403  | `{ "status":"fail", "message":"..." }`  |
| Resource tidak ditemukan (id salah)     | 404  | `{ "status":"fail", "message":"..." }`  |
| Error server                            | 500  | `{ "status":"error", "message":"..." }` |
