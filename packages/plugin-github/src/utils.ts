import { Logger } from '@react-vector-graphics/types'

export const fromBase64 = (data: string): string =>
    Buffer.from(data, 'base64').toString()

export const toBase64 = (data: string): string =>
    Buffer.from(data).toString('base64')

export const eagerPromises = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    promises: Promise<any>[],
    logger: Logger = console,
): // eslint-disable-next-line @typescript-eslint/no-explicit-any
Promise<any> => Promise.all(promises.map(p => p.catch(logger.error)))
