export default function Loading() {
    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}></div>
            <p className="font-display text-xl tracking-wide" style={{ color: 'var(--text-secondary)' }}>Loading...</p>
        </div>
    );
}
