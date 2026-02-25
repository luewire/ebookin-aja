'use client';

import { Suspense, useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function OrderContent() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOcrProcessing, setIsOcrProcessing] = useState(false);
    const [showQris, setShowQris] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [autoApproved, setAutoApproved] = useState(false);
    const [ocrMessage, setOcrMessage] = useState('');

    const planId = searchParams.get('plan');
    const redirectTo = searchParams.get('redirect') || '/browse';

    // State for the form
    const [formData, setFormData] = useState({
        name: '',
        proofOfPayment: ''
    });
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push(`/login?redirect=/order?plan=${planId}`);
            } else if (user) {
                setFormData(prev => ({ ...prev, name: user.displayName || '' }));
            }
        }
    }, [user, authLoading, router, planId]);

    if (!planId) {
        return (
            <div className="min-h-screen py-24 flex items-center justify-center transition-colors" style={{ backgroundColor: 'var(--bg-base)' }}>
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4 font-display" style={{ color: 'var(--text-primary)' }}>Paket tidak ditemukan.</h2>
                    <button onClick={() => router.push('/pricing')} className="px-6 py-2 rounded-lg font-medium transition-colors" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
                        Kembali ke Pricing
                    </button>
                </div>
            </div>
        );
    }

    // Predefine plans to get nominal
    const planDetails: Record<string, { name: string, priceText: string, amount: number }> = {
        '1month': { name: '1 Bulan', priceText: 'Rp25.000', amount: 25000 },
        '1year': { name: '1 Tahun', priceText: 'Rp240.000', amount: 240000 },
        '3months': { name: '3 Bulan', priceText: 'Rp70.000', amount: 70000 }
    };

    const selectedPlanDetails = planDetails[planId];

    if (!selectedPlanDetails) {
        return (
            <div className="min-h-screen py-24 flex items-center justify-center transition-colors" style={{ backgroundColor: 'var(--bg-base)' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Invalid plan</p>
            </div>
        );
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadError('');

        // Validate 5MB max
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('Ukuran file maksimal 5MB');
            e.target.value = '';
            return;
        }

        const allowedTypes = ['image/webp', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            setUploadError('Hanya diperbolehkan WebP, JPEG, JPG, atau PNG');
            e.target.value = '';
            return;
        }

        setSelectedFile(file);
        await uploadImage(file);
    };

    const uploadImage = async (file: File) => {
        setUploadingImage(true);
        setUploadError('');

        try {
            const token = await user?.getIdToken();
            if (!token) throw new Error('Not authenticated');

            const formDataToSend = new FormData();
            formDataToSend.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Gagal mengupload gambar');
            }

            const data = await response.json();
            setFormData(prev => ({ ...prev, proofOfPayment: data.url }));
            setUploadError('✓ Bukti pembayaran berhasil diupload!');
            setTimeout(() => setUploadError(''), 3000);
        } catch (error: any) {
            console.error('Upload failed:', error);
            setUploadError(error.message || 'Gagal mengupload gambar');
        } finally {
            setUploadingImage(false);
            setSelectedFile(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.proofOfPayment) {
            setError('Harap lengkapi semua data dan upload bukti pembayaran.');
            return;
        }

        setIsSubmitting(true);
        setIsOcrProcessing(true);
        setError('');

        try {
            const token = await user?.getIdToken();
            if (!token) throw new Error('Not authenticated');

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    package: planId,
                    amount: selectedPlanDetails.amount,
                    proofOfPayment: formData.proofOfPayment
                })
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.fraudDetected) {
                    throw new Error(data.error || 'Order ditolak oleh sistem keamanan.');
                }
                throw new Error(data.error || 'Failed to submit order');
            }

            setAutoApproved(data.autoApproved || false);
            setOcrMessage(data.message || '');
            setSuccess(true);
        } catch (err: any) {
            console.error('Submit error:', err);
            setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
            setIsOcrProcessing(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen py-24 flex items-center justify-center transition-colors px-4" style={{ backgroundColor: 'var(--bg-base)' }}>
                <div className="max-w-md w-full p-8 rounded-3xl text-center transform animate-fade-in-up" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
                    <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6" style={{ backgroundColor: autoApproved ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)' }}>
                        {autoApproved ? (
                            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                    </div>
                    <h2 className="text-3xl font-bold font-display mb-2" style={{ color: 'var(--text-primary)' }}>
                        {autoApproved ? 'Terverifikasi Otomatis! ✅' : 'Order Diterima!'}
                    </h2>
                    <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                        {ocrMessage || (autoApproved
                            ? 'Pembayaran Anda telah diverifikasi secara otomatis. Subscription langsung aktif!'
                            : 'Bukti pembayaran Anda sedang diperiksa oleh admin. Mohon tunggu maksimal 1x24 jam.')}
                    </p>
                    {autoApproved && (
                        <div className="mb-6 p-3 rounded-xl text-sm font-medium" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
                            🎉 Subscription Anda sekarang aktif. Selamat membaca!
                        </div>
                    )}
                    {!autoApproved && (
                        <div className="mb-6 p-3 rounded-xl text-sm font-medium" style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)', color: '#ca8a04' }}>
                            ⏳ Status: Menunggu verifikasi admin
                        </div>
                    )}
                    <button
                        onClick={() => router.push(autoApproved ? redirectTo : '/browse')}
                        className="w-full py-4 text-center font-bold rounded-xl transition-all"
                        style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
                    >
                        {autoApproved ? 'Lanjutkan Membaca' : 'Kembali ke Beranda'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative overview-hidden transition-colors duration-500" style={{ backgroundColor: 'var(--bg-base)' }}>
            {/* Decorative Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20 pointer-events-none" style={{ background: 'var(--accent)' }} />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full blur-[100px] opacity-10 pointer-events-none" style={{ background: 'var(--accent)' }} />

            <div className="max-w-3xl mx-auto relative z-10 animate-fade-in-up">
                {/* Header Link */}
                <div className="mb-8">
                    <Link href="/pricing" className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:underline" style={{ color: 'var(--text-secondary)' }}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Kembali ke Pricing
                    </Link>
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold font-display tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>Selesaikan Pembayaran</h1>
                <p className="mb-10 text-lg" style={{ color: 'var(--text-secondary)' }}>Silakan pindai / scan kode QRIS di bawah ini untuk membayar paket premium Anda.</p>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Col: QRIS */}
                    <div className="p-8 rounded-3xl flex flex-col items-center justify-center space-y-4" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                        <h3 className="text-xl font-bold font-display w-full text-center" style={{ color: 'var(--text-primary)' }}>Ebookin Aja</h3>
                        <p className="text-sm pb-2 w-full text-center" style={{ color: 'var(--text-secondary)', borderBottom: '1px dashed var(--border)' }}>QRIS Payment</p>

                        <div
                            className="bg-white p-4 rounded-2xl w-full max-w-[240px] shadow-sm flex items-center justify-center cursor-pointer relative group transition-transform hover:scale-[1.02]"
                            onClick={() => setShowQris(true)}
                            title="Klik untuk memperbesar"
                        >
                            <img
                                src="/qris-pembayaran.webp"
                                alt="QRIS Pembayaran Ebookin Aja"
                                className="w-full h-auto rounded-lg"
                            />
                            <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-80 transition-opacity drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                            </div>
                        </div>

                        <p className="w-full text-center text-sm mt-4" style={{ color: 'var(--text-secondary)' }}>
                            Scan menggunakan <strong>Gopay, OVO, Dana, LinkAja, BCA, atau M-Banking</strong> lainnya.
                        </p>
                    </div>

                    {/* Right Col: Form */}
                    <div className="p-8 rounded-3xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div className="space-y-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                                <div className="flex justify-between items-center pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
                                    <span className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>Paket Pilihan</span>
                                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{selectedPlanDetails.name}</span>
                                </div>
                                <div className="flex justify-between items-center text-lg">
                                    <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Total Bayar</span>
                                    <span className="font-bold font-display" style={{ color: 'var(--text-primary)' }}>{selectedPlanDetails.priceText}</span>
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 text-sm rounded-lg" style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Nama Pengirim</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Atas nama pengirim bank/e-wallet"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl transition-colors focus:outline-none"
                                    style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Screnshoot Bukti Pembayaran</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="w-full px-4 py-3 rounded-xl transition-colors focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                                />
                                {uploadingImage && <p className="mt-2 text-sm text-blue-500 animate-pulse">Mengupload gambar...</p>}
                                {uploadError && <p className={`mt-2 text-sm ${uploadError.startsWith('✓') ? 'text-green-500' : 'text-red-500'}`}>{uploadError}</p>}

                                {formData.proofOfPayment && (
                                    <div className="mt-3 relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200" style={{ borderColor: 'var(--border)' }}>
                                        <img src={formData.proofOfPayment} alt="Bukti pembayaran" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || uploadingImage || !formData.proofOfPayment}
                                className="w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: 'var(--accent)', color: '#fff', boxShadow: 'var(--shadow-md)' }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {isOcrProcessing ? 'Memverifikasi bukti pembayaran...' : 'Memproses...'}
                                    </>
                                ) : 'Kirim Bukti Pembayaran'}
                            </button>
                            {isOcrProcessing && (
                                <p className="text-xs text-center mt-2" style={{ color: 'var(--text-tertiary)' }}>
                                    Sistem sedang memvalidasi bukti pembayaran Anda secara otomatis...
                                </p>
                            )}
                        </form>
                    </div>
                </div>

            </div>
            {/* QRIS Lightbox */}
            {showQris && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
                    onClick={() => setShowQris(false)}
                >
                    <div className="relative max-w-sm w-full animate-scale-fade-in" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setShowQris(false)}
                            className="absolute -top-12 right-0 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <div className="bg-white p-6 rounded-3xl shadow-2xl">
                            <img
                                src="/qris-pembayaran.webp"
                                alt="QRIS Pembayaran Ebookin Aja"
                                className="w-full h-auto rounded-xl"
                            />
                        </div>
                        <p className="text-center text-sm text-white/60 mt-3">Klik di luar untuk menutup</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function OrderPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center transition-colors" style={{ backgroundColor: 'var(--bg-base)' }}>
                <div className="h-8 w-8 animate-spin rounded-full border-4" style={{ borderColor: 'var(--bg-elevated)', borderTopColor: 'var(--accent)' }}></div>
            </div>
        }>
            <OrderContent />
        </Suspense>
    );
}
