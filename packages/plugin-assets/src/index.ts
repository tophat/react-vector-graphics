import * as path from 'path'

import * as fs from 'fs-extra'
import * as glob from 'glob'

import {
    Configuration,
    NamingScheme,
    PluginParams,
    PluginResult,
    State,
} from '@react-vector-graphics/types'

import { pathToName } from './utils'

const ns = (s: TemplateStringsArray): string => `assets/${s}`

export const OPTIONS = {
    FILE_EXT: ns`fileExt`,
    GLOB_PATTERN: ns`globPattern`,
    NAME_SCHEME: ns`nameScheme`,
    OUTPUT_PATH: ns`outputPath`,
}

const run = async (
    code: string | null,
    config: Configuration,
    state: State,
): Promise<PluginResult> => {
    if (code) {
        const outputPath = config.options[OPTIONS.OUTPUT_PATH]
        if (outputPath && state.componentName) {
            const pathToFile = path.join(outputPath, state.componentName)
            const fileExt = config.options[OPTIONS.FILE_EXT]
            const filePath = fileExt ? `${pathToFile}.${fileExt}` : pathToFile
            fs.outputFileSync(filePath, code)
        }
        return { code, state }
    } else {
        const globPattern: string = config.options[OPTIONS.GLOB_PATTERN]
        const nameScheme: NamingScheme = config.options[OPTIONS.NAME_SCHEME]
        return glob.sync(globPattern).map(
            (filePath: string): PluginParams => ({
                code: fs.readFileSync(filePath, { encoding: 'utf-8' }),
                state: Object.assign(
                    {
                        componentName: pathToName(filePath, nameScheme),
                        filePath,
                    },
                    state,
                ),
            }),
        )
    }
}

export default run
