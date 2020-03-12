import { loadConfig } from '@svgr/core'

import { Configuration, PluginParams } from '@react-vector-graphics/types'

import { getPlugins, resolvePlugin } from './plugins'

const normalizePluginParams = (
    codeOrParams: string | PluginParams,
    prevParams: Partial<PluginParams>,
): PluginParams => {
    if (typeof codeOrParams === 'string') {
        return { state: {}, ...prevParams, code: codeOrParams }
    }
    return { ...prevParams, ...codeOrParams }
}

const run = async ({ config }: { config: Configuration }): Promise<void> => {
    const pluginArgs: PluginParams[] = [{} as PluginParams]
    for (const plugin of getPlugins(config)) {
        const [pluginFn, pluginConfig] = await Promise.all([
            resolvePlugin(plugin),
            loadConfig(config),
        ])
        const results = await Promise.all(
            pluginArgs.splice(0).map(async args => {
                const result = await pluginFn(
                    args.code,
                    pluginConfig,
                    args.state,
                )
                return (Array.isArray(result) ? result : [result])
                    .filter(Boolean)
                    .map(r => normalizePluginParams(r, args))
            }),
        )
        pluginArgs.push(...pluginArgs.concat(...results))
    }
}

export default run
