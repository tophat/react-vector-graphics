import * as path from 'path'

import * as fs from 'fs-extra'
import minimatch from 'minimatch'
import { Octokit } from '@octokit/rest'

import {
    Logger,
    NamingScheme,
    Plugin,
    PluginParams,
    State,
} from '@react-vector-graphics/types'
import { pathToName } from '@react-vector-graphics/utils'

import { OPTIONS, STATE } from './constants'
import { fromBase64 } from './utils'

const findAssets = async ({
    github: { api: githubApi, sha: commitSha, ...githubArgs },
    ...args
}: {
    folderPath: string
    github: {
        api: Octokit
        base: string
        owner: string
        repo: string
        sha: string
    }
    globPattern: string
    nameScheme: NamingScheme
    state: State
}): Promise<PluginParams[]> => {
    const compareCommitsResult = await githubApi.repos.compareCommits({
        ...githubArgs,
        head: commitSha,
    })
    const svgFiles = compareCommitsResult.data.files.filter(file => {
        const isInFolder = file.filename.startsWith(args.folderPath)
        if (!isInFolder) return false
        const relPath = path.relative(args.folderPath, file.filename)
        return minimatch(relPath, args.globPattern)
    })
    const pluginParams = svgFiles.map(
        async (file): Promise<PluginParams> => {
            const filePath = path.relative(args.folderPath, file.filename)
            const getContentResult = await githubApi.repos.getContents({
                ...githubArgs,
                path: file.filename,
                ref: commitSha,
            })
            return {
                code: fromBase64(getContentResult.data.toString()),
                state: Object.assign(
                    {
                        [STATE.COMPONENT_NAME]: pathToName(
                            filePath,
                            args.nameScheme,
                        ),
                        [STATE.FILE_PATH]: filePath,
                        [STATE.SHA]: file.sha,
                        [STATE.STATUS]: file.status,
                    },
                    args.state,
                ),
            }
        },
    )
    return Promise.all(pluginParams)
}

const writeComponent = (args: {
    assetFile?: string
    code: string
    componentName?: string
    componentFiles: { [fileName: string]: string }
    outputPath?: string
    fileExt?: string
    logger?: Logger
}): void => {
    if (!args.componentName) {
        return args.logger?.warn(
            `No '${STATE.COMPONENT_NAME}' provided for '${args.assetFile}'.`,
        )
    }
    if (!args.outputPath) {
        return args.logger?.warn(`No '${OPTIONS.OUTPUT_PATH}' provided.`)
    }
    if (!args.fileExt) {
        args.logger?.warn(`No '${OPTIONS.FILE_EXT}' provided.`)
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
    const github = {
        api: config.options[OPTIONS.API],
        base: config.options[OPTIONS.BASE],
        owner: config.options[OPTIONS.OWNER],
        repo: config.options[OPTIONS.REPO],
        sha: config.options[OPTIONS.SHA],
    }
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
            folderPath: config.options[OPTIONS.FOLDER_PATH],
            github,
            globPattern: config.options[OPTIONS.GLOB_PATTERN],
            nameScheme: config.options[OPTIONS.NAME_SCHEME],
            state,
        })
    }
}
