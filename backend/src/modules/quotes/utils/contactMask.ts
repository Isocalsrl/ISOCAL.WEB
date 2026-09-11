export function maskEmail(email: string): string {
    const [local, domain] = email.split("@");
    if (!local || !domain) return "***";
    const visible = local.length <= 2 ? local[0] ?? "*" : local.slice(0, 2);
    return `${visible}***@${domain}`;
}

export function maskPhone(phone: string): string {
    const visible = phone.slice(-4);
    return `${"*".repeat(Math.max(0, phone.length - visible.length))}${visible}`;
}
