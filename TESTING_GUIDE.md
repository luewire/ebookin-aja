# 🚀 Quick Start Guide - Pricing Feature

## Cara Testing Fitur Pricing/Subscription

### 1️⃣ Test Flow Register → Pricing

```bash
# 1. Buka halaman register
http://localhost:3000/register

# 2. Register dengan email baru
# 3. Setelah sukses, otomatis redirect ke /pricing
# 4. Pilih salah satu paket (1 Bulan/3 Bulan/1 Tahun)
# 5. Setelah pilih, redirect ke /browse
```

### 2️⃣ Test Modal Pricing di Browse

```bash
# 1. Buka halaman browse
http://localhost:3000/browse

# 2. Cari buku dengan badge "PREMIUM"
# 3. Klik buku premium tersebut
# 4. Modal pricing akan muncul otomatis
# 5. Pilih paket untuk subscribe
# 6. Setelah subscribe, akan redirect ke halaman buku
```

### 3️⃣ Test Halaman Pricing Langsung

```bash
# Akses langsung
http://localhost:3000/pricing

# Dengan redirect parameter
http://localhost:3000/pricing?redirect=/browse
```

### 4️⃣ Test Halaman Detail Buku Premium

```bash
# 1. Buka halaman detail buku
http://localhost:3000/ebooks/[book-id]

# 2. Jika buku premium dan belum subscribe:
#    - Modal pricing muncul otomatis
#    - Button "Upgrade to Read"
#
# 3. Jika sudah subscribe atau buku free:
#    - Modal tidak muncul
#    - Button "Read Now"
```

## 📋 Testing Checklist

### Visual Testing
- [ ] Semua card pricing tampil dengan benar
- [ ] Badge "BEST VALUE" muncul di paket 1 Tahun
- [ ] Discount info tampil dengan benar
- [ ] Dark mode berfungsi (toggle di navbar)
- [ ] Responsive di mobile (< 768px)
- [ ] Responsive di tablet (768px - 1024px)
- [ ] Responsive di desktop (> 1024px)
- [ ] Animasi smooth saat modal muncul/hilang
- [ ] Hover effects bekerja dengan baik

### Functional Testing
- [ ] Klik paket → Loading state muncul
- [ ] Subscription tersimpan ke localStorage
- [ ] Redirect bekerja setelah pilih paket
- [ ] Modal bisa di-close dengan tombol X
- [ ] Modal bisa di-close dengan klik backdrop
- [ ] Button "Lewati" berfungsi (jika ada)
- [ ] Link "Lihat semua paket" berfungsi
- [ ] Google sign-in button ada (jika implemented)

### Subscription Logic Testing
- [ ] `hasActiveSubscription()` return true setelah subscribe
- [ ] `getSubscription()` return data yang benar
- [ ] `getDaysRemaining()` calculate dengan benar
- [ ] Expiry date set dengan benar:
  - 1 Bulan → +30 days
  - 3 Bulan → +90 days  
  - 1 Tahun → +365 days
- [ ] Status = 'active' setelah subscribe
- [ ] SubscriptionBadge tampil dengan benar

### Browser Console Testing

```javascript
// Check subscription data
const sub = localStorage.getItem('userSubscription');
console.log(JSON.parse(sub));

// Expected output:
// {
//   plan: "1year",
//   startDate: "2024-01-16T10:30:00.000Z",
//   status: "active",
//   expiryDate: "2025-01-16T10:30:00.000Z"
// }

// Clear subscription (untuk test ulang)
localStorage.removeItem('userSubscription');

// Import utility (di browser console tidak bisa, test di code)
import { hasActiveSubscription, getDaysRemaining } from '@/lib/subscription';
console.log(hasActiveSubscription()); // true/false
console.log(getDaysRemaining()); // number of days
```

## 🐛 Common Issues & Solutions

### Issue 1: Modal tidak muncul saat klik buku premium
**Solution:**
- Check localStorage: ada subscription atau tidak?
- Clear localStorage: `localStorage.clear()`
- Refresh halaman dan coba lagi

### Issue 2: Redirect tidak berfungsi
**Solution:**
- Check browser console untuk errors
- Pastikan Next.js router imported dengan benar
- Check URL parameter `redirect` dikirim dengan benar

### Issue 3: Dark mode tidak berfungsi
**Solution:**
- Check localStorage `darkMode` value
- Toggle dark mode button di navbar
- Refresh halaman

### Issue 4: Styling tidak sesuai
**Solution:**
- Pastikan Tailwind CSS sudah running
- Check `globals.css` untuk custom styles
- Run `npm run dev` ulang

## 🎯 Test Scenarios

### Scenario 1: New User Journey
```
1. User belum punya account
2. Register → Success message → Redirect /pricing
3. Pilih paket "1 Tahun" (Best Value)
4. Redirect ke /browse
5. Browse buku
6. Klik buku premium → Langsung bisa akses
7. Klik buku free → Langsung bisa akses
```

### Scenario 2: Existing User (No Subscription)
```
1. User sudah login
2. Browse buku di /browse
3. Klik buku PREMIUM → Modal pricing muncul
4. Pilih paket "1 Bulan"
5. Modal close, redirect ke detail buku
6. Button "Read Now" aktif
```

### Scenario 3: Subscribed User
```
1. User sudah subscribe (ada di localStorage)
2. Browse buku di /browse
3. Klik buku premium → Direct ke halaman buku (no modal)
4. Klik buku free → Direct ke halaman buku
5. All content accessible
```

### Scenario 4: Direct Access ke Pricing
```
1. User akses /pricing langsung
2. Tampilan pricing page full
3. Pilih paket
4. Redirect ke /browse (default)
```

### Scenario 5: Expired Subscription
```
1. Manually set expiry date ke kemarin:
   localStorage.setItem('userSubscription', JSON.stringify({
     plan: '1month',
     startDate: '2024-01-01',
     status: 'active',
     expiryDate: '2024-01-15' // yesterday
   }));

2. Refresh halaman
3. hasActiveSubscription() should return false
4. Klik buku premium → Modal muncul
5. Status auto-update ke 'expired'
```

## 📱 Mobile Testing

Test di berbagai device sizes:

```
iPhone SE: 375px
iPhone 12: 390px
iPhone 14 Pro Max: 430px
iPad Mini: 768px
iPad Pro: 1024px
Desktop: 1280px+
```

### Mobile Specific Checks
- [ ] Modal full screen di mobile
- [ ] Cards stack vertical di mobile (grid-cols-1)
- [ ] Text readable (tidak terlalu kecil)
- [ ] Buttons touchable (min 44x44px)
- [ ] Spacing adequate
- [ ] No horizontal scroll

## ⚡ Quick Commands

```bash
# Start development server
npm run dev

# Clear localStorage via browser console
localStorage.clear()

# Force dark mode
localStorage.setItem('darkMode', 'true')
location.reload()

# Force light mode
localStorage.setItem('darkMode', 'false')
location.reload()

# Simulate 1 year subscription
localStorage.setItem('userSubscription', JSON.stringify({
  plan: '1year',
  startDate: new Date().toISOString(),
  status: 'active',
  expiryDate: new Date(Date.now() + 365*24*60*60*1000).toISOString()
}))

# Check subscription
console.log(JSON.parse(localStorage.getItem('userSubscription')))
```

## 🎨 UI Testing Points

1. **Typography**: Clear, readable, proper hierarchy
2. **Colors**: Proper contrast, consistent palette
3. **Spacing**: Adequate padding/margins
4. **Alignment**: Everything aligned properly
5. **Icons**: Proper size, clear meaning
6. **Buttons**: Clear CTA, good hover states
7. **Cards**: Proper shadows, borders
8. **Badges**: Visible, clear labels
9. **Modal**: Proper overlay, centered
10. **Animations**: Smooth, not jarring

## ✅ Final Check

Sebelum consider done:

- [ ] All flows tested and working
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Dark mode works perfectly
- [ ] Mobile responsive
- [ ] Smooth animations
- [ ] Clear user feedback
- [ ] Proper redirects
- [ ] Subscription logic correct
- [ ] LocalStorage handling secure

---

**Happy Testing! 🎉**
