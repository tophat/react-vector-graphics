export const fromBase64 = (data: string): string =>
    Buffer.from(data, 'base64').toString()

export const toBase64 = (data: string): string =>
    Buffer.from(data).toString('base64')
