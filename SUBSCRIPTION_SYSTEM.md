# Subscription-Based Access System

## Perubahan Sistem

### ❌ SEBELUMNYA (Ebook-Level Access):
- Setiap ebook punya field `isPremium` (true/false)
- Ebook premium butuh subscription
- Ebook free bisa diakses siapa saja

### ✅ SEKARANG (User-Level Access):
- **Semua ebook sama** (tidak ada perbedaan premium/free di level ebook)
- **User dengan SUBSCRIPTION PREMIUM** → bisa akses SEMUA ebook
- **User FREE (tanpa subscription)** → TIDAK bisa akses ebook apapun
- **Admin** → bisa akses SEMUA ebook

## Cara Kerja

### 1. Detail Ebook Page (`/ebooks/[id]`)
- ✅ Semua user bisa lihat info ebook (judul, author, cover, deskripsi)
- ✅ Button "📖 Read Now" **selalu tampil** untuk semua ebook
- ✅ Saat diklik:
  - **User dengan subscription/Admin** → Navigate ke reader
  - **User tanpa subscription** → Tampilkan pricing modal

### 2. Reader Page (`/reader/[id]`)
- ✅ Hanya user dengan subscription yang bisa akses
- ✅ User tanpa subscription akan melihat error: "You need a premium subscription"

### 3. API Endpoint (`/api/ebooks/[id]`)
- ✅ Cek subscription user, BUKAN isPremium ebook
- ✅ User tanpa subscription:
  - Dapat info ebook (title, author, cover, dll)
  - TIDAK dapat `pdfUrl` (file URL di-hide)
  - Response: `{ ebook: {..., pdfUrl: null }, requiresSubscription: true }`
- ✅ User dengan subscription:
  - Dapat semua data termasuk `pdfUrl`

## Testing

### Test sebagai User FREE (tanpa subscription):
1. **Login sebagai user biasa** (bukan admin)
2. **Buka halaman ebook**: `http://localhost:3000/ebooks/cml96hbpc0001kbi1p2gaccos`
3. **Klik "📖 Read Now"** 
4. **Expected**: Pricing modal muncul ✅

### Test sebagai Admin:
1. **Login sebagai admin**
2. **Buka halaman ebook**
3. **Klik "📖 Read Now"**
4. **Expected**: Langsung ke reader, bisa baca ebook ✅

### Test sebagai User dengan Subscription:
1. **Login sebagai user dengan subscription aktif**
2. **Klik "📖 Read Now"**
3. **Expected**: Langsung ke reader ✅

## Scripts

### Cek Status Ebooks:
```bash
npx tsx scripts/list-ebooks-status.ts
```

### Assign File ke Ebook:
```bash
npx tsx scripts/assign-ebook-file.ts <ebook-id> <file-name>
```
Example:
```bash
npx tsx scripts/assign-ebook-file.ts cml96hbpc0001kbi1p2gaccos 1770165360086-fyb0lbk.epub
```

## File Changes

### Modified Files:
1. `app/api/ebooks/[id]/route.ts` - Check user subscription instead of ebook.isPremium
2. `app/(main)/ebooks/[id]/page.tsx` - Button always visible, check subscription onClick
3. `app/reader/[id]/page.tsx` - Handle requiresSubscription response

### New Scripts:
1. `scripts/reset-ebook-roles.ts` - Set all ebooks isPremium = false
2. `scripts/list-ebooks-status.ts` - List all ebooks with file status
3. `scripts/assign-ebook-file.ts` - Assign EPUB file to ebook

## Important Notes

⚠️ **Field `isPremium` pada ebook tetap ada di database**, tapi tidak digunakan lagi untuk access control. Access control sekarang 100% berdasarkan user subscription.

✅ **Keuntungan sistem baru:**
- Lebih simple: cek subscription user, bukan per-ebook
- Lebih flexible: admin bisa ubah subscription plan tanpa ubah ebook
- Consistent UX: semua ebook tampil sama, user tahu mereka butuh subscription untuk akses apapun
