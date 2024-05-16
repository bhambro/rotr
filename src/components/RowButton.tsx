'use client';

export default function RowButton({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button type="button" className={className + " border border-slate-300 shadow-sm rounded-xl px-6 py-3 w-[44rem] bg-secondary hover:bg-primary"} {...props}>
            <h3>{children}</h3>
        </button>
    )
}