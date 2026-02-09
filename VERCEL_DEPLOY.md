# Deploy ke Vercel & Akses Situs

Panduan singkat untuk deploy **ebookin-aja** ke Vercel dan membuat situs bisa diakses.

---

## 1. Deploy ke Vercel

### Opsi A: Deploy lewat GitHub (disarankan)

1. **Push kode ke GitHub** (jika belum):
   ```bash
   git add .
   git commit -m "Prepare for Vercel deploy"
   git push origin main
   ```

2. **Buka [vercel.com](https://vercel.com)** → Login → **Add New Project**.

3. **Import** repo GitHub Anda (ebookin-aja / ebook-platform).

4. **Jangan** klik Deploy dulu. Tambah Environment Variables dulu (langkah 2 di bawah).

### Opsi B: Deploy lewat Vercel CLI

1. **Pasang & login** (sekali saja):
   ```bash
   npm i -g vercel
   vercel login
   ```

2. **Deploy** dari folder project:
   ```bash
   cd c:\laragon\www\ebookin-aja-main
   npx vercel
   ```
   Ikuti prompt (link ke project baru atau yang sudah ada). Setelah itu, **wajib** set Environment Variables di dashboard Vercel (langkah 2).

---

## 2. Environment Variables di Vercel

Agar build dan runtime jalan, **semua** variabel berikut harus diisi di Vercel:

**Lokasi:** Project → **Settings** → **Environment Variables**

Isi nilai yang sama dengan di `.env` lokal Anda. Centang **Production**, **Preview**, dan **Development** sesuai kebutuhan.

| Variable | Wajib | Keterangan |
|----------|-------|------------|
| `DATABASE_URL` | ✅ | Connection string PostgreSQL (Neon) |
| `DIRECT_URL` | ✅ | Direct DB URL (sama atau tanpa pooler) |
| `FIREBASE_PROJECT_ID` | ✅ | Firebase project ID |
| `FIREBASE_CLIENT_EMAIL` | ✅ | Service account email |
| `FIREBASE_PRIVATE_KEY` | ✅ | Private key (paste utuh, termasuk `\n`) |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | ✅ | Firebase client API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | ✅ | `*.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ✅ | Sama dengan FIREBASE_PROJECT_ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | ✅ | Storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ✅ | Sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | ✅ | App ID |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret |
| `NEXT_PUBLIC_APP_URL` | ✅ | **URL production** (lihat langkah 4) |
| `IPAYMU_VA` | Opsional | Virtual account iPaymu |
| `IPAYMU_API_KEY` | Opsional | API key iPaymu |
| `IPAYMU_IS_PRODUCTION` | Opsional | `false` untuk sandbox |

**Penting:** Setelah menambah atau mengubah env, lakukan **Redeploy** (Deployments → ⋮ → Redeploy).

---

## 3. Build di Vercel

- **Build Command:** `npm run build` (sudah dipakai lewat `vercel.json`)
- **Output:** Next.js (`.next`) – Vercel mendeteksi otomatis
- **Install Command:** `npm install` (default)

Jika build gagal:
- Cek log di tab **Building** di Vercel.
- Pastikan semua env wajib sudah diisi.
- Untuk error Prisma: pastikan `DATABASE_URL` dan `DIRECT_URL` benar dan bisa diakses dari internet (Neon sudah bisa).

---

## 4. Agar Situs Bisa Diakses

### 4.1 URL production

Setelah deploy pertama berhasil, Vercel memberi URL seperti:

- `https://ebookin-aja.vercel.app`  
atau  
- `https://<nama-project>-<tim>.vercel.app`

**Update di Vercel Environment Variables:**

- `NEXT_PUBLIC_APP_URL` = `https://ebookin-aja.vercel.app` (ganti dengan URL project Anda)

Lalu **Redeploy** sekali lagi.

### 4.2 Firebase: authorized domains

Agar login/register jalan di production:

1. Buka [Firebase Console](https://console.firebase.google.com) → project **ebookin-aja**.
2. **Authentication** → **Settings** → **Authorized domains**.
3. Klik **Add domain** → masukkan domain Vercel Anda, misalnya:
   - `ebookin-aja.vercel.app`
   - atau domain kustom jika sudah di-set di Vercel (misalnya `app.ebookin.com`).

Tanpa ini, Firebase akan memblokir login dari domain production.

### 4.3 Database

- Database (Neon) sudah bisa diakses dari internet; tidak perlu setting tambahan di Vercel.
- Migrasi: jalankan **di lokal** (atau dari CI) dengan `DATABASE_URL`/`DIRECT_URL` production:
  ```bash
  npx prisma migrate deploy
  ```

---

## 5. Ringkasan Cek List

- [ ] Repo terhubung ke Vercel (GitHub) atau project dibuat lewat CLI
- [ ] Semua Environment Variables wajib diisi di Vercel
- [ ] `NEXT_PUBLIC_APP_URL` = URL production (setelah deploy pertama)
- [ ] Build berhasil (Deployments → status Success)
- [ ] Domain Vercel ditambahkan di Firebase **Authorized domains**
- [ ] Migrasi DB sudah dijalankan untuk production (`prisma migrate deploy`)

Setelah itu, buka URL production (misalnya `https://ebookin-aja.vercel.app`) — situs harus bisa diakses dan login/register jalan.

---

## 6. Troubleshooting

| Masalah | Solusi |
|--------|--------|
| Build gagal: Prisma / DB | Cek `DATABASE_URL` dan `DIRECT_URL`, pastikan bisa diakses dari internet. |
| 500 di API | Cek **Functions** / **Runtime Logs** di Vercel; sering karena env belum di-set atau salah. |
| Login tidak jalan | Tambah domain Vercel di Firebase **Authorized domains**. |
| Redirect / callback salah | Pastikan `NEXT_PUBLIC_APP_URL` sama dengan URL yang dipakai user (tanpa trailing slash). |

Jika pakai **custom domain** di Vercel, ganti semua referensi `ebookin-aja.vercel.app` di atas dengan domain Anda dan tambahkan domain itu juga di Firebase Authorized domains.
