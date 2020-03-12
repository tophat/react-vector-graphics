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

import { pathToName } from './utils'
import { STATE } from './constants'

import { OPTIONS } from '.'

const findAssets = (args: {
    globPattern: string
    nameScheme: NamingScheme
    state: State
}): PluginParams[] => {
    return glob.sync(args.globPattern).map(
        (filePath: string): PluginParams => ({
            code: fs.readFileSync(filePath, { encoding: 'utf-8' }),
            state: Object.assign(
                {
                    [STATE.COMPONENT_NAME]: pathToName(
                        filePath,
                        args.nameScheme,
                    ),
                    [STATE.FILE_PATH]: filePath,
                },
                args.state,
            ),
        }),
    )
}

const writeComponent = (args: {
    assetFile?: string
    code: string
    componentName?: string
    componentFiles: { [fileName: string]: string }
    outputPath?: string
    fileExt?: string
    logger: Logger
}): void => {
    if (!args.componentName) {
        return args.logger.warn(
            `No '${STATE.COMPONENT_NAME}' provided for '${args.assetFile}'.`,
        )
    }
    if (!args.outputPath) {
        return args.logger.warn(`No '${OPTIONS.OUTPUT_PATH}' provided.`)
    }
    if (!args.fileExt) {
        args.logger.warn(`No '${OPTIONS.FILE_EXT}' provided.`)
    }

    const componentFiles = Object.entries(args.componentFiles)
    const pathToFolder = path.join(
        args.outputPath,
        componentFiles.length ? args.componentName : '',
    )
    const pathToFile = path.join(
        pathToFolder,
        componentFiles.length ? 'index' : args.componentName,
    )
    const componentFilePath = args.fileExt
        ? `${pathToFile}.${args.fileExt}`
        : pathToFile
    fs.outputFileSync(componentFilePath, args.code)
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
