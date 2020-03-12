import { Configuration, Plugin } from '@react-vector-graphics/types'

const DEFAULT_PLUGINS: (string | Plugin)[] = []

export const getPlugins = (config: Configuration): (string | Plugin)[] => {
    return config.plugins ?? DEFAULT_PLUGINS
}

export const resolvePlugin = async (
    plugin: Plugin | string,
): Promise<Plugin> => {
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
