# 📚 Ebookin - Platform E-Book Modern

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1.2-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" />
  <img src="https://img.shields.io/badge/Supabase-2.90-3ECF8E?style=for-the-badge&logo=supabase" />
</div>

<div align="center">
  <h3>✨ Platform Perpustakaan Digital Modern dengan Fitur Lengkap ✨</h3>
  <p>Tugas Akhir - SMK Telkom Purwokerto</p>
</div>

---

## 🎯 Tentang Proyek

**Ebookin** adalah platform perpustakaan digital modern yang dikembangkan sebagai tugas akhir di **SMK Telkom Purwokerto**. Platform ini memungkinkan pengguna untuk membaca, mengelola, dan melacak progres bacaan mereka dengan antarmuka yang menarik dan responsif.

### 🌟 Fitur Utama

- 📖 **Perpustakaan Digital** - Koleksi e-book lengkap dengan kategori
- 👤 **Manajemen Profil** - Profil pengguna dengan tracking aktivitas membaca
- 🌓 **Dark Mode** - Mode gelap dengan transisi smooth
- 📊 **Progress Tracking** - Lacak kemajuan bacaan setiap buku
- 🔐 **Autentikasi Lengkap** - Login/Register dengan Google OAuth
- 👀 **Password Toggle** - Lihat/sembunyikan password dengan animasi
- 👑 **Admin Panel** - Dashboard admin untuk mengelola konten
- 📱 **Fully Responsive** - Optimal di semua perangkat (mobile, tablet, desktop)
- ⚡ **Real-time Updates** - Sinkronisasi data real-time dengan Supabase
- 🎨 **UI/UX Modern** - Desain clean dengan animasi smooth

### 🎨 Teknologi yang Digunakan

#### Frontend
- **Next.js 16.1.2** - React framework dengan App Router
- **React 19.2.3** - Library UI modern
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first CSS framework

#### Backend & Database
- **Supabase** - Backend-as-a-Service (Auth + Database)
- **PostgreSQL** - Database relasional

#### Fitur Tambahan
- **OAuth 2.0** - Google Sign-In integration
- **Server-Side Rendering** - SEO optimized
- **Dark Mode** - dengan localStorage persistence
- **Responsive Design** - Mobile-first approach

---

## 🚀 Cara Instalasi

### Prasyarat

Pastikan sudah terinstall:
- **Node.js** versi 18.x atau lebih tinggi
- **npm** atau **yarn** atau **pnpm**
- **Git**

### Langkah-langkah Instalasi

#### 1️⃣ Clone Repository

```bash
git clone https://github.com/luewire/ebookin-aja.git
cd ebookin-aja
```

#### 2️⃣ Install Dependencies

```bash
npm install
# atau
yarn install
# atau
pnpm install
```

#### 3️⃣ Setup Environment Variables

Buat file `.env.local` di root folder:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Cara mendapatkan Supabase credentials:**
1. Buat akun di [Supabase](https://supabase.com)
2. Create new project
3. Pergi ke Settings → API
4. Copy `Project URL` dan `anon public` key

#### 4️⃣ Setup Database

Jalankan SQL script berikut di Supabase SQL Editor:

```sql
-- Create ebooks table
CREATE TABLE ebooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  cover TEXT,
  category TEXT,
  description TEXT,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reading_sessions table
CREATE TABLE reading_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ebook_id UUID REFERENCES ebooks(id) ON DELETE CASCADE,
  progress DECIMAL DEFAULT 0,
  last_read TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE ebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public ebooks are viewable by everyone"
  ON ebooks FOR SELECT
  USING (true);

CREATE POLICY "Users can view their own reading sessions"
  ON reading_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reading sessions"
  ON reading_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reading sessions"
  ON reading_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Create wishlist table
CREATE TABLE wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ebook_id UUID REFERENCES ebooks(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'want_to_read' CHECK (status IN ('want_to_read', 'reading', 'finished')),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, ebook_id)
);

ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own wishlist"
  ON wishlist FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

#### 5️⃣ (Opsional) Enable Google OAuth

Untuk mengaktifkan Google Sign-In:

1. Pergi ke Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Dapatkan OAuth credentials dari [Google Cloud Console](https://console.cloud.google.com)
4. Masukkan Client ID dan Client Secret
5. Tambahkan Authorized redirect URIs: `https://your-project.supabase.co/auth/v1/callback`

#### 6️⃣ Jalankan Development Server

```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
```

Buka browser dan akses [http://localhost:3000](http://localhost:3000)

---

## 📂 Struktur Folder

```
ebookin-aja/
├── app/                      # Next.js App Router
│   ├── admin/               # Admin dashboard
│   ├── api/                 # API routes
│   ├── ebooks/              # E-book pages
│   ├── login/               # Login page
│   ├── register/            # Register page
│   ├── profile/             # User profile
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── components/              # Reusable components
│   ├── AuthProvider.tsx     # Auth context provider
├── lib/                     # Utilities
│   └── supabase.ts          # Supabase client
├── public/                  # Static assets
├── .env.local              # Environment variables (buat sendiri)
├── next.config.ts          # Next.js config
├── tailwind.config.ts      # Tailwind config
├── tsconfig.json           # TypeScript config
└── README.md               # Documentation
```

---

## 🎓 Informasi Tugas Akhir

**Nama Proyek:** Ebookin - Platform E-Book Modern  
**Sekolah:** SMK Telkom Purwokerto  
**Tahun:** 2024/2025  
**Pembimbing:** -  

### 📝 Deskripsi Proyek

Proyek ini dikembangkan sebagai implementasi dari pembelajaran selama di SMK Telkom Purwokerto, khususnya dalam bidang:
- Pengembangan Web Modern (Next.js, React, TypeScript)
- Database Management (PostgreSQL, Supabase)
- UI/UX Design (Tailwind CSS, Responsive Design)
- Authentication & Authorization
- API Integration

---

## 🌐 Demo

- **Live Demo:** [Coming Soon]
- **Video Demo:** [Coming Soon]

---

## 📸 Screenshots

### 🏠 Homepage
- Hero section dengan koleksi e-book
- Dark mode support
- Responsive design

### 👤 Profile Page
- User statistics (Books, Finished, Reading)
- Reading activity tracking
- Progress bars untuk setiap buku

### 🔐 Authentication
- Modern login/register design
- Google OAuth integration
- Password visibility toggle

### 👑 Admin Panel
- Manage e-books
- View statistics
- User management

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:
1. Fork repository ini
2. Buat branch baru (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📧 Kontak

**Developer:** Luewire  
**GitHub:** [@luewire](https://github.com/luewire)  
**Project Link:** [https://github.com/luewire/ebookin-aja](https://github.com/luewire/ebookin-aja)

---

## 🙏 Acknowledgments

Terima kasih kepada:
- SMK Telkom Purwokerto
- Para guru pembimbing
- Teman-teman yang mendukung
- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

<div align="center">
  <p>Dibuat dengan ❤️ oleh siswa SMK Telkom Purwokerto</p>
  <p>⭐ Jangan lupa beri star jika proyek ini bermanfaat!</p>
</div>
