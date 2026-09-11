export class EmailConfigurationError extends Error { constructor(message: string) { super(message); this.name = "EmailConfigurationError"; } }
export class EmailProviderError extends Error { constructor(readonly provider: string, readonly code: string, message: string) { super(message); this.name = "EmailProviderError"; } }
