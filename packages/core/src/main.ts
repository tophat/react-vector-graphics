import { loadConfig } from '@svgr/core'

import {
    Configuration,
    Logger,
    PluginParams,
} from '@react-vector-graphics/types'

import { getPlugins, resolvePlugin } from './plugins'
import { getLogger } from './logging'

const normalizePluginParams = (
    codeOrParams: string | PluginParams,
    prevParams: Partial<PluginParams>,
): PluginParams => {
    if (typeof codeOrParams === 'string') {
        return { state: {}, ...prevParams, code: codeOrParams }
    }
    return { ...prevParams, ...codeOrParams }
}

export const run = async ({
    config,
    logger = getLogger(),
}: {
    config: Configuration
    logger?: Logger
}): Promise<void> => {
    logger.info('options:', config.options)
    const pluginArgs: PluginParams[] = [{} as PluginParams]
    for (const plugin of getPlugins(config)) {
        logger.info('plugin:', plugin)
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
                    logger,
                )
                return (Array.isArray(result) ? result : [result])
                    .filter(Boolean)
                    .map(r => normalizePluginParams(r, args))
            }),
        )
        pluginArgs.push(...pluginArgs.concat(...results))
    }
}
