export function formatCurrency(value: number | string | null | undefined, decimals = 0): string {
    const num = Number(value ?? 0);
    return `৳${num.toLocaleString('en-BD', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    })}`;
}

export function formatNumber(value: number | string | null | undefined): string {
    return Number(value ?? 0).toLocaleString('en-BD');
}

export function formatDate(value: string | null | undefined): string {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
