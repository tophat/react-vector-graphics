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

export const run = async (
    code: string | null,
    config: Configuration,
    state: State,
): Promise<PluginResult> => {
    if (code) {
        // const outputPath = config.options['assets/outputPath']
        // const outputFolder = path.join(outputPath, state.componentName)
        // fs.outputFileSync()
        // console.log(code)
        return { code, state }
    } else {
        const globPattern: string = config.options['assets/globPattern']
        const nameScheme: NamingScheme = config.options['assets/nameScheme']
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
