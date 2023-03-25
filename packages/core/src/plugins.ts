import type { Config, Plugin } from '@react-vector-graphics/types'
import type { ConfigPlugin } from '@svgr/core'

const DEFAULT_PLUGINS: (string | Plugin)[] = []

export const getPlugins = (
    config: Config,
): (string | Plugin | ConfigPlugin)[] => {
    return config.plugins ?? DEFAULT_PLUGINS
}

export const resolvePlugin = async (
    plugin: ConfigPlugin | Plugin | string,
): Promise<Plugin> => {
    if (typeof plugin === 'function') {
        return plugin as Plugin
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

    throw new Error(`Invalid plugin '${plugin}'`)
}
