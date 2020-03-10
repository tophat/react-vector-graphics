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

async function run(config: Configuration): Promise<void> {
    if (!config.entries?.length) {
        const defaultEntry = {
            find: {
                config: {
                    globPattern: argv.pattern,
                    outputPath: argv.output,
                },
                plugin: '@react-vector-graphics/plugin-assets',
            },
        }
        config.entries = [defaultEntry]
    }
    await rvgCore({ config })
}

loadConfig().then(run)
