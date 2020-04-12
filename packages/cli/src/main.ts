import * as path from 'path'

import yargs from 'yargs'
import { CosmiconfigResult } from 'cosmiconfig/dist/types'

import { Configuration, Logger } from '@react-vector-graphics/types'
import { getLogger, default as rvgCore } from '@react-vector-graphics/core'

import * as conf from './config'

const onLoadConfig = (config: Configuration, logger: Logger) => (
    result: CosmiconfigResult,
): void => {
    if (result?.filepath && !result.isEmpty) {
        logger.info(`Loaded config from ${result.filepath}`)
        Object.assign(config, result.config)
        const configDir = path.dirname(result.filepath)
        if (configDir !== process.cwd()) {
            logger.info(`Changing current directory to ${configDir}`)
            process.chdir(configDir)
        }
    } else if (result?.isEmpty) {
        logger.info(`Skipping empty config at ${result.filepath}`)
    } else {
        logger.info('No config loaded')
    }
}

const getConfig = async (
    config: Configuration,
    logger: Logger,
): Promise<Configuration> => {
    const currentDir = process.cwd()
    logger.info(`Searching for config in ${currentDir}`)
    const result = await conf.find(currentDir)
    if (!result) {
        logger.info('No config found')
    }

    logger.info('Start getting cli options')
    const { argv } = yargs(process.argv)
        .usage('Usage: $0 --config [config]')
        .option('config', {
            default: result?.filepath,
            describe: 'Config file path',
            type: 'string',
        })
        .demandOption(['config'])

    await conf.load(argv.config).then(onLoadConfig(config, logger))
    return config
}

export const run = async (): Promise<void> => {
    const defaultConfig = conf.init()
    const logger = getLogger()
    const config = await getConfig(defaultConfig, logger)
    if (!config.plugins.length) {
        logger.info('Setting the minimal plugin configuration')
        const assetPlugin = '@react-vector-graphics/plugin-assets'
        config.plugins = [assetPlugin, '@svgr/plugin-jsx', assetPlugin]
    }
    await rvgCore({ config, logger })
}
