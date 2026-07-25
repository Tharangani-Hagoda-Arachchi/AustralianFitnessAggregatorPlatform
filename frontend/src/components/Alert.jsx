import React from 'react'

const styles = {
    error: 'bg-clay-400/10 text-clay-500 border-clay-400/30',
    success: 'bg-brand-50 text-brand-700 border-brand-100',
    info: 'bg-ink/5 text-ink/70 border-ink/10',
};

const Alert = ({ type = 'info', children, onDismiss }) => {
    if (!children) return null;
    return (
        <div className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${styles[type]}`}>
            <span>{children}</span>
            {onDismiss && (
                <button
                    type="button"
                    onClick={onDismiss}
                    className="text-current opacity-60 hover:opacity-100"
                    aria-label="Dismiss"
                >
                    ✕
                </button>
            )}
        </div>
    )
}

export default Alert