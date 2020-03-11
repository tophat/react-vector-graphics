import yargs from 'yargs'

import { Configuration } from '@react-vector-graphics/types'
import rvgCore from '@react-vector-graphics/core'

import { loadConfig } from './config'

const { argv } = yargs
    .usage('Usage: $0 -p [pattern] -o [output]')
    .option('pattern', {
        alias: 'p',
        default: '*.svg',
        describe: 'SVG files glob pattern',
        type: 'string',
    })
    .option('output', {
        alias: 'o',
        default: './',
        describe: 'Destination folder',
        type: 'string',
    })
    .demandOption(['p', 'o'])

const run = async (config: Configuration): Promise<void> => {
    config.options.globPattern = argv.pattern
    const assetPlugin = '@react-vector-graphics/plugin-assets'
    if (!config.plugins.includes(assetPlugin)) {
        config.plugins.unshift(assetPlugin)
    }
    config.options['assets/globPattern'] = argv.pattern
    config.options['assets/outputPath'] = argv.output
    await rvgCore({ config })
}

loadConfig().then(run)
