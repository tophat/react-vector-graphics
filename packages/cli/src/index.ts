import yargs from 'yargs'

import { Configuration } from '@react-vector-graphics/types'
import rvgCore from '@react-vector-graphics/core'
import { OPTIONS } from '@react-vector-graphics/plugin-assets'

import { loadConfig } from './config'

const { argv } = yargs
    .usage('Usage: $0 -p [pattern] -o [output]')
    .option('pattern', {
        alias: 'p',
        describe: 'SVG files glob pattern',
        type: 'string',
    })
    .option('output', {
        alias: 'o',
        describe: 'Destination folder',
        type: 'string',
    })
    .option('ext', {
        alias: 'e',
        default: 'js',
        describe: 'Component file extension',
        type: 'string',
    })
    .demandOption(['pattern', 'output'])

const run = async (config: Configuration): Promise<void> => {
    const assetPlugin = '@react-vector-graphics/plugin-assets'
    if (!config.plugins?.length) {
        config.plugins = [assetPlugin, '@svgr/plugin-jsx', assetPlugin]
    }
    config.options[OPTIONS.GLOB_PATTERN] = argv.pattern
    config.options[OPTIONS.OUTPUT_PATH] = argv.output
    config.options[OPTIONS.FILE_EXT] = argv.ext
    await rvgCore({ config })
}

loadConfig().then(run)
