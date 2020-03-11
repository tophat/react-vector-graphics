import { loadConfig } from '@svgr/core'

import { Configuration, PluginParams } from '@react-vector-graphics/types'

import { resolvePlugin } from './plugins'

const normalizePluginParams = (
    codeOrParams: string | PluginParams,
    prevParams: Partial<PluginParams> = {},
): PluginParams => {
    if (typeof codeOrParams === 'string') {
        return { state: {}, ...prevParams, code: codeOrParams }
    }
    return { ...prevParams, ...codeOrParams }
}

const run = async ({ config }: { config: Configuration }): Promise<void> => {
    let pluginArgs: Partial<PluginParams>[] = [{}]
    for (const plugin of config.plugins || []) {
        const [pluginFn, pluginConfig] = await Promise.all([
            resolvePlugin(plugin),
            loadConfig(config),
        ])
        const results = await Promise.all(
            pluginArgs.map(({ code, state }) =>
                pluginFn(code, pluginConfig, state),
            ),
        )
        pluginArgs = []
        results.forEach((result, i) => {
            pluginArgs.push(
                ...(Array.isArray(result) ? result : [result])
                    .filter(Boolean)
                    .map(r => normalizePluginParams(r, pluginArgs[i])),
            )
        })
    }
}

export default run
