// eslint-disable-next-line prettier/prettier
import { type Config as CoreConfig, loadConfig } from '@svgr/core'

import { getLogger } from './logging'
import { getPlugins, resolvePlugin } from './plugins'

import type { Config, Logger, PluginParams } from '@react-vector-graphics/types'

const normalizePluginParams = (
    codeOrParams: string | PluginParams,
    prevParams: Partial<PluginParams>,
): PluginParams => {
    if (typeof codeOrParams === 'string') {
        // @ts-expect-error does not properly handle missing state
        return {
            ...prevParams,
            code: codeOrParams,
        }
    }
    return { ...prevParams, ...codeOrParams }
}

export const run = async ({
    config,
    logger = getLogger(),
}: {
    config: Config
    logger?: Logger
}): Promise<void> => {
    logger.info('options:', config.options)
    const pluginParams: PluginParams[] = [{} as PluginParams]
    for (const plugin of getPlugins(config)) {
        logger.info('plugin:', plugin)
        const [pluginFn, pluginConfig] = await Promise.all([
            resolvePlugin(plugin),
            loadConfig(config as CoreConfig),
        ])
        const results = await Promise.all(
            pluginParams.splice(0).map(async (params) => {
                const result = await pluginFn(
                    params.code,
                    pluginConfig,
                    params.state,
                )
                return (Array.isArray(result) ? result : [result])
                    .filter(Boolean)
                    .map((r) => normalizePluginParams(r, params))
            }),
        )
        pluginParams.push(...pluginParams.concat(...results))
    }
}
