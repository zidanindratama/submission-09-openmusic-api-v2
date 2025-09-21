# 🎵 OpenMusic API v2 (Hapi + PostgreSQL)

Proyek ini adalah **RESTful API** untuk mengelola **album**, **lagu**, serta fitur **playlist** (private) dengan **autentikasi JWT**.  
Dibangun menggunakan **Node.js (ESM)**, **Hapi**, dan **PostgreSQL**.

API ini disusun untuk memenuhi kriteria submission **OpenMusic V2**:

- Registrasi & Autentikasi JWT
- Playlist privat (restricted access)
- Relasi via Foreign Key
- Data Validation dengan Joi
- Error Handling terpusat

* **Opsional**: Kolaborasi Playlist & Playlist Activities.

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
> - Pastikan database sudah ada:
>   ```sql
>   CREATE DATABASE openmusicv2;
>   ```
> - Ganti `ACCESS_TOKEN_KEY` dan `REFRESH_TOKEN_KEY` dengan nilai rahasia.

---

## ✨ Fitur Utama

### 1. Registrasi & Autentikasi

- `POST /users` → registrasi user baru
- `POST /authentications` → login, kembalikan accessToken & refreshToken
- `PUT /authentications` → perbarui accessToken dengan refreshToken
- `DELETE /authentications` → logout (hapus refreshToken dari DB)

### 2. Playlist (Restricted Access)

- `POST /playlists`, `GET /playlists`, `DELETE /playlists/{id}`
- `POST /playlists/{id}/songs`, `GET /playlists/{id}/songs`, `DELETE /playlists/{id}/songs`
- Hanya pemilik (atau kolaborator) yang bisa akses playlist.

### 3. Albums & Songs (Public)

- CRUD Albums
- CRUD Songs + filter query `?title=...&performer=...`
- Album detail menampilkan daftar lagu di dalamnya

### 4. Validasi Data (Joi)

- Semua payload (users, auth, albums, songs, playlists, collabs, dsb) tervalidasi.

### 5. Error Handling

- `400` → payload invalid
- `401` → token hilang/invalid
- `403` → akses dilarang (bukan owner/kolaborator)
- `404` → resource tidak ditemukan
- `500` → error server internal

### 6. Opsional

- Kolaborasi: `POST/DELETE /collaborations`
- Playlist Activities: `GET /playlists/{id}/activities`

---

## 📂 Struktur Proyek

```
submission-09-openmusic-api-v2/
├─ .env.example
├─ .eslintrc.cjs
├─ migrations/                # migration files (node-pg-migrate)
│   └─ 001_init.cjs
├─ src/
│  ├─ server.js
│  ├─ container.js
│  ├─ exceptions/
│  ├─ api/
│  │   ├─ albums/
│  │   ├─ songs/
│  │   ├─ users/
│  │   ├─ authentications/
│  │   ├─ playlists/
│  │   ├─ collaborations/     # opsional
│  │   └─ activities/         # opsional
│  ├─ services/postgres/
│  └─ validator/
└─ package.json
```

---

## 🧰 Teknologi

- Node.js LTS (≥18)
- @hapi/hapi, @hapi/jwt
- pg (PostgreSQL driver)
- Joi (validasi schema)
- dotenv, auto-bind
- node-pg-migrate (migration DB)
- ESLint (standard), nodemon

---

## ▶️ Cara Menjalankan

1. **Install dependency**

   ```bash
   npm install
   ```

2. **Setup database**

   - Buat DB `openmusicv2`.
   - Copy `.env.example` → `.env`, sesuaikan dengan kredensial lokal.

3. **Jalankan migrasi schema**

   ```bash
   npm run migrate
   ```

   (Menggunakan `node-pg-migrate` & folder `migrations/`)

4. **Development**

   ```bash
   npm run dev
   # http://localhost:5000
   ```

5. **Production**
   ```bash
   npm start
   ```

---

## 🔐 Autentikasi

- **Login**

  - `POST /authentications`
  - Body: `{ "username": "dicoding", "password": "secret" }`
  - Respon:
    ```json
    {
      "status": "success",
      "data": {
        "accessToken": "...",
        "refreshToken": "..."
      }
    }
    ```

- **Gunakan Access Token**

  - Header: `Authorization: Bearer <accessToken>`

- **Refresh Token**

  - `PUT /authentications` → body `{ "refreshToken": "..." }`

- **Logout**
  - `DELETE /authentications` → hapus refresh token dari DB.

---

## 📡 Contoh Respons

### GET /playlists

```json
{
  "status": "success",
  "data": {
    "playlists": [
      { "id": "playlist-123", "name": "Lagu Indie", "username": "dicoding" }
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

### GET /playlists/{id}/activities

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

1. Import collection & environment (v2) ke Postman.
2. Set variable `{{port}} = 5000`.
3. Jalankan urutan:
   1. Users
   2. Authentications
   3. Albums
   4. Songs
   5. Playlists
   6. (Opsional) Collaborations & Activities
4. Jika data kotor, kosongkan tabel:
   ```sql
   TRUNCATE albums, songs, users, authentications, playlists,
   playlist_songs, playlist_song_activities, collaborations
   RESTART IDENTITY CASCADE;
   ```

---

## 🐛 Error Handling Ringkas

| Kondisi                       | Kode | Body                                   |
| ----------------------------- | ---- | -------------------------------------- |
| Payload tidak valid           | 400  | `{ "status":"fail","message":"..." }`  |
| Token hilang/invalid          | 401  | `{ "status":"fail","message":"..." }`  |
| Akses bukan owner/kolaborator | 403  | `{ "status":"fail","message":"..." }`  |
| Resource tidak ditemukan      | 404  | `{ "status":"fail","message":"..." }`  |
| Error server                  | 500  | `{ "status":"error","message":"..." }` |
