import * as path from 'path'

import { pathToName } from '@react-vector-graphics/utils'
import * as fs from 'fs-extra'
import * as glob from 'glob'

import { OPTIONS, STATE } from './constants'

import type { PluginAssetsOptions } from './types'
import type {
    Logger,
    NamingScheme,
    Plugin,
    PluginParams,
    State,
} from '@react-vector-graphics/types'

const findAssets = (params: {
    globPattern: string
    nameScheme: NamingScheme
    state: Omit<State, 'componentName'> & { componentName?: string }
}): PluginParams[] => {
    return glob.sync(params.globPattern).map(
        (filePath: string): PluginParams => ({
            code: fs.readFileSync(filePath, { encoding: 'utf-8' }),
            state: Object.assign(
                {
                    [STATE.COMPONENT_NAME]: pathToName(
                        filePath,
                        params.nameScheme,
                    ),
                    [STATE.FILE_PATH]: filePath,
                },
                params.state,
            ) as State,
        }),
    )
}

const writeComponent = (params: {
    assetFile?: string
    code: string
    componentName?: string
    componentFiles: { [fileName: string]: string }
    fileExt?: string | undefined
    logger?: Logger
    outputPath?: string
}): void => {
    if (!params.componentName) {
        return params.logger?.warn(
            `No '${STATE.COMPONENT_NAME}' provided for '${params.assetFile}'.`,
        )
    }
    if (!params.outputPath) {
        return params.logger?.warn(`No '${OPTIONS.OUTPUT_PATH}' provided.`)
    }
    if (!params.fileExt) {
        params.logger?.warn(`No '${OPTIONS.FILE_EXT}' provided.`)
    }

    const componentFiles = Object.entries(params.componentFiles)
    const pathToFolder = path.join(
        params.outputPath,
        componentFiles.length ? params.componentName : '',
    )
    const pathToFile = path.join(
        pathToFolder,
        componentFiles.length ? 'index' : params.componentName,
    )
    const componentFilePath = params.fileExt
        ? `${pathToFile}.${params.fileExt}`
        : pathToFile
    fs.outputFileSync(componentFilePath, params.code)
    for (const [fileName, fileContents] of componentFiles) {
        const filePath = path.join(pathToFolder, fileName)
        fs.outputFileSync(filePath, fileContents)
    }
}

export const run: Plugin = async (code, config, state, logger) => {
    const options: Partial<PluginAssetsOptions> = config.options ?? {}

    if (code) {
        const opts = {
            assetFile: state[STATE.FILE_PATH],
            code,
            // @ts-expect-error componentFiles is added to state
            componentFiles: state[STATE.COMPONENT_FILES] ?? {},
            componentName: state[STATE.COMPONENT_NAME],
            fileExt: options?.[OPTIONS.FILE_EXT],
            logger,
            outputPath: options?.[OPTIONS.OUTPUT_PATH],
        }
        writeComponent(opts)
        return { code, state: state as State }
    } else {
        if (!options?.[OPTIONS.GLOB_PATTERN]) {
            throw new Error('Invariant violation. Missing glob pattern.')
        }
        return findAssets({
            // @ts-expect-error Args need to be pre-validated
            globPattern: options?.[OPTIONS.GLOB_PATTERN],
            nameScheme: options?.[OPTIONS.NAME_SCHEME] as NamingScheme,
            state,
        })
    }
}
