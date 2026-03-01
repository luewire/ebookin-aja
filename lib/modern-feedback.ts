type ToastType = 'success' | 'error' | 'info';

interface ConfirmOptions {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    danger?: boolean;
}

const getToastContainer = () => {
    const id = 'modern-toast-container';
    let container = document.getElementById(id);
    if (!container) {
        container = document.createElement('div');
        container.id = id;
        container.style.position = 'fixed';
        container.style.top = '16px';
        container.style.right = '16px';
        container.style.zIndex = '99999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';
        container.style.pointerEvents = 'none';
        document.body.appendChild(container);
    }
    return container;
};

export const showModernToast = (message: string, type: ToastType = 'info', duration = 2800) => {
    if (typeof window === 'undefined') return;

    const palette = {
        success: { bg: '#10B981', text: '#ffffff' },
        error: { bg: '#EF4444', text: '#ffffff' },
        info: { bg: '#1F2937', text: '#ffffff' },
    };

    const container = getToastContainer();
    const toast = document.createElement('div');
    toast.style.pointerEvents = 'auto';
    toast.style.background = palette[type].bg;
    toast.style.color = palette[type].text;
    toast.style.padding = '12px 16px';
    toast.style.borderRadius = '12px';
    toast.style.boxShadow = '0 12px 30px rgba(0,0,0,0.22)';
    toast.style.fontSize = '14px';
    toast.style.fontWeight = '600';
    toast.style.maxWidth = '360px';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-8px)';
    toast.style.transition = 'opacity 180ms ease, transform 180ms ease';
    toast.textContent = message;

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    });

    window.setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-8px)';
        window.setTimeout(() => {
            toast.remove();
        }, 180);
    }, duration);
};

export const showModernConfirm = ({
    title = 'Please confirm',
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    danger = false,
}: ConfirmOptions): Promise<boolean> => {
    if (typeof window === 'undefined') return Promise.resolve(false);

    return new Promise((resolve) => {
        const isDark = document.documentElement.classList.contains('dark');

        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.inset = '0';
        overlay.style.zIndex = '100000';
        overlay.style.background = 'rgba(0,0,0,0.58)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.padding = '16px';

        const modal = document.createElement('div');
        modal.style.width = '100%';
        modal.style.maxWidth = '430px';
        modal.style.borderRadius = '16px';
        modal.style.padding = '18px';
        modal.style.boxShadow = '0 20px 50px rgba(0,0,0,0.35)';
        modal.style.border = `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#E5E7EB'}`;
        modal.style.background = isDark ? '#111827' : '#FFFFFF';
        modal.style.color = isDark ? '#F3F4F6' : '#111827';
        modal.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif';

        const titleEl = document.createElement('h3');
        titleEl.textContent = title;
        titleEl.style.margin = '0 0 8px 0';
        titleEl.style.fontSize = '18px';
        titleEl.style.fontWeight = '700';

        const messageEl = document.createElement('p');
        messageEl.textContent = message;
        messageEl.style.margin = '0';
        messageEl.style.fontSize = '14px';
        messageEl.style.lineHeight = '1.5';
        messageEl.style.color = isDark ? '#D1D5DB' : '#4B5563';

        const actions = document.createElement('div');
        actions.style.display = 'flex';
        actions.style.justifyContent = 'flex-end';
        actions.style.gap = '10px';
        actions.style.marginTop = '18px';

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = cancelText;
        cancelBtn.style.padding = '9px 14px';
        cancelBtn.style.borderRadius = '10px';
        cancelBtn.style.border = `1px solid ${isDark ? 'rgba(255,255,255,0.16)' : '#D1D5DB'}`;
        cancelBtn.style.background = 'transparent';
        cancelBtn.style.color = isDark ? '#F3F4F6' : '#111827';
        cancelBtn.style.cursor = 'pointer';
        cancelBtn.style.fontWeight = '600';

        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = confirmText;
        confirmBtn.style.padding = '9px 14px';
        confirmBtn.style.borderRadius = '10px';
        confirmBtn.style.border = 'none';
        confirmBtn.style.background = danger ? '#DC2626' : '#4F46E5';
        confirmBtn.style.color = '#fff';
        confirmBtn.style.cursor = 'pointer';
        confirmBtn.style.fontWeight = '700';

        actions.appendChild(cancelBtn);
        actions.appendChild(confirmBtn);
        modal.appendChild(titleEl);
        modal.appendChild(messageEl);
        modal.appendChild(actions);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        const cleanup = (result: boolean) => {
            document.removeEventListener('keydown', handleEsc);
            overlay.remove();
            resolve(result);
        };

        const handleEsc = (ev: KeyboardEvent) => {
            if (ev.key === 'Escape') cleanup(false);
        };

        cancelBtn.onclick = () => cleanup(false);
        confirmBtn.onclick = () => cleanup(true);
        overlay.onclick = (ev) => {
            if (ev.target === overlay) cleanup(false);
        };
        document.addEventListener('keydown', handleEsc);
        confirmBtn.focus();
    });
};
