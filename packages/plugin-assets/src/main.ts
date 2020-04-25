import * as path from 'path'

import * as fs from 'fs-extra'
import * as glob from 'glob'

import {
    Logger,
    NamingScheme,
    Plugin,
    PluginParams,
    State,
} from '@react-vector-graphics/types'
import { pathToName } from '@react-vector-graphics/utils'

import { OPTIONS, STATE } from './constants'

const findAssets = (params: {
    globPattern: string
    nameScheme: NamingScheme
    state: State
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
            ),
        }),
    )
}

const writeComponent = (params: {
    assetFile?: string
    code: string
    componentName?: string
    componentFiles: { [fileName: string]: string }
    fileExt?: string
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
    if (code) {
        writeComponent({
            assetFile: state[STATE.FILE_PATH],
            code,
            componentFiles: state[STATE.COMPONENT_FILES] ?? {},
            componentName: state[STATE.COMPONENT_NAME],
            fileExt: config.options[OPTIONS.FILE_EXT],
            logger,
            outputPath: config.options[OPTIONS.OUTPUT_PATH],
        })
        return { code, state }
    } else {
        return findAssets({
            globPattern: config.options[OPTIONS.GLOB_PATTERN],
            nameScheme: config.options[OPTIONS.NAME_SCHEME],
            state,
        })
    }
}
