'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { showModernToast } from '@/lib/modern-feedback';

interface Order {
    id: string;
    userId: string;
    package: string;
    amount: number;
    proofOfPayment: string;
    status: 'PENDING' | 'AUTO_APPROVED' | 'APPROVED' | 'REJECTED';
    ocrExtractedText?: string | null;
    ocrValidationResult?: any;
    ocrRejectionReason?: string | null;
    createdAt: string;
    user: {
        name: string | null;
        email: string;
        username: string | null;
    };
}

export default function AdminOrdersPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal State
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [expandedOcr, setExpandedOcr] = useState<string | null>(null); // orderId

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/login');
            } else {
                const isAdmin = user.role === 'Admin' || user.role === 'ADMIN' || user.email === 'admin@admin.com';
                if (!isAdmin) {
                    router.push('/unauthorized');
                } else {
                    fetchOrders();
                }
            }
        }
    }, [user, authLoading, router]);

    const fetchOrders = async () => {
        try {
            const token = await user?.getIdToken();
            const response = await fetch('/api/admin/orders', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch orders');
            const data = await response.json();
            setOrders(data.orders);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, status: 'APPROVED' | 'REJECTED') => {
        try {
            const token = await user?.getIdToken();
            const response = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (!response.ok) throw new Error(`Failed to ${status.toLowerCase()} order`);

            // Update local state without full refetch
            setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
            showModernToast(`Order ${status === 'APPROVED' ? 'approved' : 'rejected'} successfully`, 'success');
        } catch (err: any) {
            showModernToast(err.message || 'Failed to update order status', 'error');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'AUTO_APPROVED':
                return 'bg-emerald-100 text-emerald-700';
            case 'APPROVED':
                return 'bg-green-100 text-green-700';
            case 'REJECTED':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-yellow-100 text-yellow-700';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'AUTO_APPROVED': return '✅ Auto-Approved';
            case 'APPROVED': return '✓ Approved';
            case 'REJECTED': return '✗ Rejected';
            default: return '⏳ Pending';
        }
    };

    if (loading || authLoading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
                <h1 className="text-2xl font-bold font-display flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--accent-muted)' }}>
                        <svg className="w-5 h-5" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                    </div>
                    Orders
                </h1>
                <div className="flex items-center gap-4">
                    <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                        Total: {orders.length} | Pending: {orders.filter(o => o.status === 'PENDING').length}
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }}>
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                    <thead className="uppercase border-b" style={{ backgroundColor: 'var(--bg-elevated)', borderBottomColor: 'var(--border)', color: 'var(--text-tertiary)' }}>
                        <tr>
                            <th className="px-6 py-4 font-medium">Date</th>
                            <th className="px-6 py-4 font-medium">User</th>
                            <th className="px-6 py-4 font-medium">Package</th>
                            <th className="px-6 py-4 font-medium">Amount</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">OCR Info</th>
                            <th className="px-6 py-4 font-medium">Proof</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y" style={{ divideColor: 'var(--border)' }}>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                    Belum ada order manual yang masuk.
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <React.Fragment key={order.id}>
                                    <tr className="hover:bg-[var(--bg-elevated)] transition-colors">
                                        <td className="px-6 py-4" style={{ color: 'var(--text-secondary)' }}>
                                            {new Date(order.createdAt).toLocaleDateString('id-ID', {
                                                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{order.user?.name || 'Unknown'}</div>
                                            <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{order.user?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium" style={{ color: 'var(--text-secondary)' }}>
                                            {order.package}
                                        </td>
                                        <td className="px-6 py-4 font-medium" style={{ color: 'var(--text-primary)' }}>
                                            Rp {order.amount.toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(order.status)}`}>
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {order.ocrRejectionReason ? (
                                                <button
                                                    onClick={() => setExpandedOcr(expandedOcr === order.id ? null : order.id)}
                                                    className="text-xs font-medium text-orange-500 hover:underline flex items-center gap-1"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                                                    {expandedOcr === order.id ? 'Tutup' : 'Lihat Detail'}
                                                </button>
                                            ) : order.status === 'AUTO_APPROVED' ? (
                                                <span className="text-xs text-emerald-500 font-medium">✓ OCR Valid</span>
                                            ) : (
                                                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => setPreviewImage(order.proofOfPayment)}
                                                className="text-sm font-medium hover:underline text-blue-500"
                                            >
                                                Lihat Bukti
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            {order.status === 'PENDING' && (
                                                <>
                                                    <button
                                                        onClick={() => updateOrderStatus(order.id, 'APPROVED')}
                                                        className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-green-500 text-white hover:bg-green-600 transition-colors"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => updateOrderStatus(order.id, 'REJECTED')}
                                                        className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                    {/* Expanded OCR Detail Row */}
                                    {expandedOcr === order.id && (
                                        <tr key={`${order.id}-ocr`}>
                                            <td colSpan={8} className="px-6 py-4" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                                                <div className="space-y-3 text-sm">
                                                    {order.ocrRejectionReason && (
                                                        <div>
                                                            <span className="font-semibold text-orange-600">Alasan OCR Gagal:</span>
                                                            <p style={{ color: 'var(--text-secondary)' }}>{order.ocrRejectionReason}</p>
                                                        </div>
                                                    )}
                                                    {order.ocrValidationResult && (
                                                        <div>
                                                            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Detail Validasi:</span>
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
                                                                {Object.entries(order.ocrValidationResult).filter(([k]) => k.endsWith('Valid')).map(([key, value]) => (
                                                                    <span key={key} className={`px-2 py-1 rounded text-xs font-medium ${value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                                        {key.replace('Valid', '')}: {value ? '✓' : '✗'}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {order.ocrExtractedText && (
                                                        <div>
                                                            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Teks OCR:</span>
                                                            <pre className="mt-1 p-3 rounded-lg text-xs max-h-32 overflow-y-auto whitespace-pre-wrap" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                                                                {order.ocrExtractedText}
                                                            </pre>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Image Preview Modal */}
            {previewImage && (
                <div
                    className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4"
                    style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
                    onClick={() => setPreviewImage(null)}
                >
                    <div className="relative max-w-sm w-full my-auto" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute -top-10 right-0 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                            <div className="px-4 py-3 text-center" style={{ borderBottom: '1px solid var(--border)' }}>
                                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Bukti Pembayaran</span>
                            </div>
                            <div className="p-3 flex items-center justify-center" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                                <img
                                    src={previewImage}
                                    alt="Bukti Transfer"
                                    className="max-w-full max-h-[80vh] object-contain rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
