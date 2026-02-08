# Category Management Feature

## Overview
Admin dapat mengelola kategori buku melalui halaman admin. Kategori disimpan di database dan dapat dipilih saat menambah atau mengedit buku.

## Features

### 1. **Manage Categories (Admin Page)**
- URL: `/admin/categories`
- Fitur:
  - ✅ Lihat semua kategori dengan jumlah buku
  - ✅ Tambah kategori baru
  - ✅ Edit nama kategori
  - ✅ Toggle aktif/non-aktif kategori
  - ✅ Hapus kategori (jika tidak ada buku yang menggunakan)
  - ✅ Auto-generate slug dari nama kategori

### 2. **Category API Endpoints**

#### GET /api/categories
Mendapatkan semua kategori beserta jumlah buku.

**Response:**
```json
{
  "categories": [
    {
      "id": "clx123...",
      "name": "Fiction",
      "slug": "fiction",
      "isActive": true,
      "createdAt": "2026-02-06T...",
      "updatedAt": "2026-02-06T...",
      "_count": {
        "ebooks": 5
      }
    }
  ]
}
```

#### POST /api/categories
Membuat kategori baru (Admin only).

**Request:**
```json
{
  "name": "Science Fiction"
}
```

**Response:**
```json
{
  "category": {
    "id": "clx123...",
    "name": "Science Fiction",
    "slug": "science-fiction",
    "isActive": true,
    "createdAt": "2026-02-06T...",
    "updatedAt": "2026-02-06T..."
  }
}
```

#### PATCH /api/categories/[id]
Update kategori (Admin only).

**Request:**
```json
{
  "name": "Sci-Fi",
  "isActive": true
}
```

#### DELETE /api/categories/[id]
Hapus kategori (Admin only).

**Note:** Kategori tidak dapat dihapus jika masih ada buku yang menggunakannya.

### 3. **Ebook Form Integration**
Form tambah/edit buku di `/admin/ebooks` sekarang menggunakan dropdown kategori dinamis yang diambil dari database.

## Database Schema

### Category Model
```prisma
model Category {
  id        String   @id @default(cuid())
  name      String   @unique
  slug      String   @unique
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ebooks    Ebook[]

  @@index([slug])
  @@index([isActive])
}
```

### Ebook Model (Updated)
```prisma
model Ebook {
  id              String            @id @default(cuid())
  title           String
  author          String
  description     String?
  coverUrl        String?
  pdfUrl          String?
  publicId        String?
  categoryId      String
  category        Category          @relation(fields: [categoryId], references: [id])
  // ... other fields
  
  @@index([categoryId])
}
```

## Migration Steps

### 1. Run Migration Script
Jalankan script migrasi untuk mengkonversi data kategori lama (string) ke model Category baru:

```bash
npx tsx scripts/migrate-categories.ts
```

Script ini akan:
- ✅ Membuat tabel Category jika belum ada
- ✅ Ekstrak kategori unik dari ebook yang ada
- ✅ Buat record Category untuk setiap kategori unik
- ✅ Update ebook untuk menggunakan categoryId
- ✅ Hapus kolom category lama (string)

### 2. Alternative: Use Prisma Migrate
Atau gunakan Prisma migrate (jika schema sudah sesuai):

```bash
npx prisma migrate dev --name add_category_model
```

### 3. Generate Prisma Client
Setelah migrasi, generate Prisma client:

```bash
npx prisma generate
```

## Usage Examples

### Creating a Category (Admin)
1. Buka `/admin/categories`
2. Klik "Add New Category"
3. Masukkan nama kategori (contoh: "Self-Help")
4. Klik "Create"
5. Slug akan di-generate otomatis (contoh: "self-help")

### Adding a Book with Category
1. Buka `/admin/ebooks`
2. Klik "Add New Ebook"
3. Isi form: title, author, description, dll
4. Pilih kategori dari dropdown (yang sudah dibuat sebelumnya)
5. Upload cover dan file ebook
6. Klik "Save"

### Filtering Books by Category
Di halaman admin atau browse:
- Pilih kategori dari dropdown filter
- Hanya buku dengan kategori tersebut yang ditampilkan

## API Changes

### Backward Compatibility
API tetap mengembalikan `category` sebagai string untuk backward compatibility:

```javascript
// Frontend tetap menggunakan category name
const ebookData = {
  title: "My Book",
  author: "John Doe",
  category: "Fiction", // Masih string
  // ...
};

// API secara otomatis mengkonversi ke categoryId
```

### Updated Endpoints
Semua endpoint ebook (public dan admin) sudah diupdate untuk mendukung Category relation:
- ✅ GET /api/ebooks - List ebooks dengan category name
- ✅ GET /api/ebooks/[id] - Single ebook dengan category name
- ✅ GET /api/admin/ebooks - Admin list dengan category name
- ✅ POST /api/admin/ebooks - Create dengan category name
- ✅ PATCH /api/admin/ebooks - Update dengan category name

## Validation Rules

### Category Name
- ✅ Required
- ✅ Unique
- ✅ Minimum 1 karakter
- ✅ Maximum 255 karakter
- ✅ Tidak boleh duplikat

### Category Slug
- ✅ Auto-generated dari name
- ✅ Lowercase
- ✅ Hanya huruf, angka, dan dash (-)
- ✅ Unique

### Delete Category
- ❌ Tidak bisa dihapus jika masih ada buku yang menggunakan
- ✅ Error message: "Cannot delete category with X associated ebook(s)"

## UI Components

### Category Management Page
- 📊 Grid layout dengan cards untuk setiap kategori
- 🔢 Menampilkan jumlah buku per kategori
- 🎨 Dark mode support
- ⚡ Real-time updates setelah CRUD operations
- 🔄 Toggle active/inactive status
- ✏️ Inline edit dengan modal
- 🗑️ Delete dengan konfirmasi

### Ebook Form Dropdown
- 📝 Dynamic dropdown dari database
- 🔄 Auto-refresh saat kategori berubah
- ✅ Validasi required
- 🎯 Hanya menampilkan kategori aktif

## Security

### Authorization
- ✅ Semua operasi CRUD kategori memerlukan admin role
- ✅ Token authentication via Firebase
- ✅ Middleware validation di setiap endpoint

### Validation
- ✅ Input sanitization
- ✅ SQL injection prevention (via Prisma)
- ✅ XSS prevention
- ✅ CSRF protection

## Testing Checklist

- [ ] Create kategori baru
- [ ] Edit kategori yang ada
- [ ] Toggle kategori active/inactive
- [ ] Delete kategori tanpa buku
- [ ] Coba delete kategori dengan buku (harus error)
- [ ] Tambah buku dengan kategori baru
- [ ] Edit buku dan ganti kategori
- [ ] Filter buku by kategori di admin page
- [ ] Filter buku by kategori di browse page
- [ ] Check API responses untuk backward compatibility

## Troubleshooting

### Error: "Category not found"
- Pastikan kategori sudah dibuat di `/admin/categories`
- Check spelling kategori saat create/update ebook

### Error: "Cannot delete category"
- Category masih digunakan oleh ebook
- Hapus atau reassign ebook ke kategori lain terlebih dahulu

### Migration Failed
- Check database connection
- Pastikan tidak ada constraint conflicts
- Backup database sebelum migration
- Run migration script dengan flag --verbose

## Future Enhancements

- [ ] Bulk import categories via CSV
- [ ] Category icons/images
- [ ] Category descriptions
- [ ] Hierarchical categories (parent-child)
- [ ] Category usage analytics
- [ ] Auto-suggest categories saat create ebook
- [ ] Category merge functionality

## Support

Jika ada masalah atau pertanyaan, hubungi tim development atau buat issue di repository.
