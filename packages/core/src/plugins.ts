import { FindPlugin } from '@react-vector-graphics/types'

export const resolvePlugin = async (
    plugin: FindPlugin | string,
): Promise<FindPlugin> => {
    if (typeof plugin === 'function') {
        return plugin
    }

    if (typeof plugin === 'string') {
        const resolved = await import(plugin)

        if (typeof resolved === 'function') {
            return resolved
        }

        if (typeof resolved.default === 'function') {
            return resolved.default
        }
    }

    throw new Error(`Invalid plugin "${plugin}"`)
}
