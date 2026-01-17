# Pricing & Subscription Feature

Fitur pricing/subscription telah ditambahkan ke aplikasi ebook-platform dengan tampilan yang sesuai dengan tema aplikasi.

## 📁 File yang Dibuat

### 1. `/app/pricing/page.tsx`
Halaman standalone untuk pemilihan paket langganan yang dapat diakses langsung melalui route `/pricing`.

**Fitur:**
- 3 pilihan paket: 1 Bulan (Rp25.000), 1 Tahun (Rp240.000), 3 Bulan (Rp70.000)
- Badge "BEST VALUE" pada paket 1 Tahun
- Informasi diskon pada setiap paket
- Support dark mode
- Tombol "Lewati" untuk user yang sudah login
- Redirect ke halaman yang ditentukan setelah memilih paket
- Google Sign-in button

### 2. `/components/PricingModal.tsx`
Komponen modal yang muncul ketika user mencoba mengakses buku premium tanpa subscription.

**Fitur:**
- Modal popup dengan backdrop blur
- Menampilkan judul buku yang ingin diakses
- 3 pilihan paket langganan
- Tombol close
- Link ke halaman pricing lengkap
- Auto-redirect setelah memilih paket
- Animasi smooth

### 3. `/components/SubscriptionBadge.tsx`
Komponen badge untuk menampilkan status subscription user.

**Fitur:**
- Tampilkan plan yang aktif (Free/Premium)
- Hitung dan tampilkan hari tersisa
- Call-to-action untuk upgrade
- Gradient background untuk premium users
- Responsive design

### 4. `/lib/subscription.ts`
Utility helper functions untuk mengelola subscription.

**Functions:**
- `hasActiveSubscription()` - Check apakah user punya subscription aktif
- `getSubscription()` - Get detail subscription saat ini
- `saveSubscription(planId)` - Save subscription dengan expiry date otomatis
- `updateSubscriptionStatus(status)` - Update status subscription
- `cancelSubscription()` - Cancel subscription
- `clearSubscription()` - Hapus data subscription
- `getDaysRemaining()` - Hitung hari tersisa subscription
- `getPlanDetails(planId)` - Get detail paket by ID
- `canAccessPremium()` - Check akses ke konten premium

### 5. `/app/ebooks/[id]/page.tsx`
Halaman detail buku yang terintegrasi dengan sistem subscription.

**Fitur:**
- Tampilkan detail lengkap buku
- Auto-show pricing modal untuk buku premium
- Button "Read Now" atau "Upgrade to Read"
- Add to Readlist functionality
- Rating display
- Book metadata (pages, language, price)

## 🔄 Implementasi Flow

### 1. Setelah Register
```
User register → Success → Redirect ke `/pricing?redirect=/browse`
↓
User pilih paket → Subscription saved (localStorage + expiry date)
↓
Redirect ke `/browse`
```

### 2. Saat Klik Buku Premium
```
User klik buku premium di `/browse`
↓
Check: hasActiveSubscription()?
├─ YES → Direct ke halaman buku
└─ NO  → Show PricingModal
         ↓
         User pilih paket → Subscription saved
         ↓
         Redirect ke halaman buku
```

### 3. Akses Halaman Buku Premium Langsung
```
User buka `/ebooks/{id}`
↓
Fetch book data
↓
Check: is_premium && !hasActiveSubscription()?
├─ YES → Auto show PricingModal
└─ NO  → Show book details normally
```

## 💻 Cara Menggunakan

### Di Route/Component Lain

#### Import PricingModal
```tsx
import PricingModal from '@/components/PricingModal';

const [showPricingModal, setShowPricingModal] = useState(false);

// Render modal
<PricingModal
  isOpen={showPricingModal}
  onClose={() => setShowPricingModal(false)}
  bookTitle="Judul Buku"
  redirectTo="/target-page"
/>
```

#### Menggunakan Subscription Utilities
```typescript
import { 
  hasActiveSubscription, 
  getSubscription,
  getDaysRemaining,
  saveSubscription 
} from '@/lib/subscription';

// Check subscription
if (hasActiveSubscription()) {
  // User has active subscription
}

// Get subscription details
const sub = getSubscription();
console.log(sub?.plan); // '1month' | '1year' | '3months'

// Get days remaining
const days = getDaysRemaining();
console.log(`${days} days left`);

// Save new subscription
saveSubscription('1year'); // Auto-calculate expiry date
```

#### Tambah SubscriptionBadge
```tsx
import SubscriptionBadge from '@/components/SubscriptionBadge';

// In your component
<SubscriptionBadge />
```

## 📦 Paket yang Tersedia

| Paket | Harga | Per | Diskon | Expiry | Fitur |
|-------|-------|-----|--------|--------|-------|
| 1 Bulan | Rp25.000 | /bln | - | +1 bulan | Personalized Recommendations, Highlight & Catatan, Sinkronisasi |
| 1 Tahun | Rp240.000 | /thn | Rp60.000 (20% off) | +1 tahun | Semua fitur + Akses eksklusif rilis baru |
| 3 Bulan | Rp70.000 | /3 bln | Rp5.000 | +3 bulan | Personalized Recommendations, Highlight & Catatan, Sinkronisasi |

## 🎨 Styling & Design

Desain mengikuti tema aplikasi:
- **Color scheme:** Blue gradient (from-blue-600 to-blue-700) untuk primary actions
- **Dark mode:** Full support dengan proper contrast
- **Responsive:** Mobile-first design, optimal untuk semua device sizes
- **Animations:** Smooth transitions, fade-in, slide-down effects
- **Typography:** Clear hierarchy dengan font weights yang tepat
- **Shadow & Effects:** Subtle shadows untuk depth, hover effects untuk interactivity

### Components Styling
```css
/* Primary Button */
bg-gradient-to-r from-blue-600 to-blue-700
hover:from-blue-700 hover:to-blue-800

/* Premium Badge */
bg-purple-600 (for premium items)
bg-green-600 (for free items)

/* Modal Backdrop */
bg-black/60 backdrop-blur-sm

/* Cards */
rounded-xl shadow-lg border-2
hover:shadow-xl hover:scale-105
```

## 🔐 Data Structure

### Subscription Object (localStorage)
```typescript
{
  plan: '1month' | '1year' | '3months',
  startDate: '2024-01-16T...',
  status: 'active' | 'expired' | 'cancelled',
  expiryDate: '2024-02-16T...'
}
```

## 🚀 Routes

- `/pricing` - Halaman pilih paket (standalone)
- `/pricing?redirect=/target` - Dengan redirect setelah pilih paket
- `/browse` - Browse buku dengan modal pricing
- `/ebooks/[id]` - Detail buku dengan check subscription

## ⚠️ TODO / Improvement Selanjutnya

### 1. Backend Integration
- [ ] Simpan subscription ke Supabase database
- [ ] Create `subscriptions` table
- [ ] API endpoints untuk subscription management
- [ ] Server-side validation

### 2. Payment Gateway
- [ ] Integrasi Midtrans/Xendit
- [ ] Handle payment callback
- [ ] Generate invoice
- [ ] Email notification

### 3. Expiry & Renewal
- [ ] Cron job untuk check expired subscriptions
- [ ] Email reminder 7 days before expiry
- [ ] Auto-renewal option
- [ ] Grace period handling

### 4. User Management
- [ ] Halaman "Manage Subscription" di profile
- [ ] Cancel subscription feature
- [ ] Upgrade/downgrade plan
- [ ] Invoice/payment history
- [ ] Download receipt

### 5. Security
- [ ] Encrypt subscription data
- [ ] JWT/session validation
- [ ] Rate limiting untuk API
- [ ] Prevent client-side manipulation
- [ ] Audit log untuk subscription changes

### 6. Analytics
- [ ] Track subscription conversions
- [ ] A/B testing untuk pricing
- [ ] User behavior analytics
- [ ] Revenue reporting

### 7. Additional Features
- [ ] Free trial period (7/14 days)
- [ ] Promo codes/coupons
- [ ] Referral program
- [ ] Family/team plans
- [ ] Student discount

## 🧪 Testing Checklist

- [ ] User dapat register dan langsung ke pricing
- [ ] Modal pricing muncul saat klik buku premium
- [ ] Subscription tersimpan dengan benar
- [ ] Expiry date terkalkulasi dengan benar
- [ ] Days remaining tampil dengan akurat
- [ ] Dark mode berfungsi di semua halaman
- [ ] Responsive di mobile, tablet, desktop
- [ ] Navigation flow berjalan lancar
- [ ] SubscriptionBadge update real-time
- [ ] Redirect setelah pilih paket bekerja

## 📝 Notes

**IMPORTANT:** Saat ini subscription disimpan di `localStorage` untuk demo purposes. 

**Untuk production harus:**
1. Pindah ke database (Supabase/PostgreSQL)
2. Implement proper authentication
3. Add payment gateway integration
4. Server-side validation untuk akses premium content
5. Encrypted storage untuk sensitive data

## 🎯 Key Features Highlight

✅ **3 Flexible Plans** - Monthly, quarterly, yearly options
✅ **Smart Detection** - Auto-show modal untuk premium content
✅ **Seamless UX** - Smooth navigation dengan proper redirects
✅ **Visual Feedback** - Clear indicators untuk free vs premium
✅ **Dark Mode Ready** - Full support untuk dark theme
✅ **Mobile Optimized** - Responsive design untuk semua device
✅ **Easy Integration** - Simple API untuk check subscription
✅ **Utility Helpers** - Reusable functions untuk subscription logic

## 📞 Support

Untuk pertanyaan atau issues terkait pricing feature:
1. Check dokumentasi ini terlebih dahulu
2. Review code di files yang disebutkan
3. Test flow sesuai checklist
4. Implement TODO items sesuai prioritas

---

**Created:** January 2026
**Version:** 1.0.0
**Status:** ✅ Ready for Integration (Demo/Development)

