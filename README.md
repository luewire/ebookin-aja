# ebookin-aja-main

Project ebookin-aja-main adalah platform ebook digital dengan berbagai fitur lengkap untuk pengguna dan admin.

## Fitur Utama

### 1. Manajemen Kategori
- Tambah, edit, hapus kategori ebook
- Pengelolaan kategori di panel admin

### 2. Manajemen Banner
- Upload dan pengaturan banner promosi
- Banner dapat diaktifkan/nonaktifkan

### 3. Manajemen Ebook
- Upload ebook (PDF/EPUB)
- Edit, hapus, pengelolaan metadata
- Fitur pencarian ebook

### 4. Sistem Pembaca Ebook
- EPUB reader terintegrasi
- Progress membaca disimpan

### 5. Sistem Readlist
- Tambah ebook ke daftar baca
- Pengelolaan readlist pengguna

### 6. Sistem Langganan
- Paket langganan dengan integrasi pembayaran (Midtrans, Ipaymu)
- Badge langganan pada profil

### 7. Manajemen Pengguna
- Registrasi, login, reset password
- Panel admin untuk pengelolaan user

### 8. Statistik
- Statistik penggunaan dan pembelian

### 9. Integrasi Cloudinary & Firebase
- Upload file ke Cloudinary
- Autentikasi dan data pengguna via Firebase

### 10. Notifikasi
- Notifikasi aktivitas penting

### 11. Admin Panel
- Pengelolaan semua fitur melalui dashboard admin

### 12. API
- Endpoint RESTful untuk semua fitur utama

---

## Instalasi & Setup

1. Clone repo ini:
   ```bash
   git clone https://github.com/ebookin-aja-main/ebookin-aja-main.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Jalankan development server:
   ```bash
   npm run dev
   ```

### Konfigurasi Production

Tambahkan environment variable berikut saat deploy production:

```env
NODE_ENV=production
DEBUG=false
LOG_LEVEL=warn

RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=120

CACHE_ENABLED=true
PUBLIC_API_CACHE_MAX_AGE=60
PUBLIC_API_CACHE_S_MAX_AGE=300
PUBLIC_API_CACHE_STALE=600

# Optional: base path untuk runtime folder check
RUNTIME_BASE_DIR=/var/www/ebookin-aja
```

Keterangan singkat:
- `DEBUG=false`: mematikan debug behavior di runtime config.
- `LOG_LEVEL=warn`: log hanya `warn` dan `error` (lebih aman untuk production).
- `RATE_LIMIT_*`: mengaktifkan throttling request API di middleware.
- `CACHE_*`: mengaktifkan caching header untuk endpoint publik (`/api/ebooks`, `/api/categories`, `/api/banners`).
- `RUNTIME_BASE_DIR`: lokasi root folder runtime (`storage`, `logs`, `uploads`, `tmp`).

### Permission & File Path Check

Saat `npm run start`, server akan otomatis:
- memastikan folder `storage`, `logs`, `uploads`, `tmp` ada,
- memastikan semua folder tersebut writable,
- fail-fast jika ada permission/path yang salah.

Jalankan manual jika perlu:

```bash
npm run check-runtime-paths
```

---

## Kontribusi

Silakan buat issue atau pull request untuk fitur baru atau perbaikan bug.

---

##  Support

Built with: Next.js, TypeScript, PostgreSQL, Prisma, Firebase, Midtrans

Architecture: Production-ready, scalable, secure

Status: ✅ Backend Complete - Ready for Frontend Integration
