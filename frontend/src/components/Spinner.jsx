import React from 'react'

const Spinner = ({ full = false, label = 'Loading…' }) => {
    const spinner = (
        <div className="flex items-center gap-2 text-sm text-ink/60">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
            {label}
        </div>
    );

    if (!full) return spinner;
    return (
        <div className="flex min-h-[40vh] items-center justify-center">
            {spinner}
        </div>
    )
}

export default Spinner