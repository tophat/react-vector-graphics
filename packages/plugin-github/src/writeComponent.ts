import * as path from 'path'

import { Octokit } from '@octokit/rest'

import { Logger } from '@react-vector-graphics/types'

import {
    COMMIT_MESSAGE_PATTERNS,
    COMMIT_MESSAGE_PLACEHOLDER,
    OPTIONS,
    STATE,
    STATUSES,
} from './constants'
import { eagerPromises, toBase64 } from './utils'

const isAdded = (status: string): boolean => status === STATUSES.ADDED
const isRemoved = (status: string): boolean => status === STATUSES.REMOVED
const isRenamed = (status: string): boolean => status === STATUSES.RENAMED

const removeIconFiles = async (
    githubApi: Octokit,
    githubArgs: { head: string; owner: string; repo: string },
    componentName: string,
    componentPath: string,
    commitMessagePattern: string = COMMIT_MESSAGE_PATTERNS.DELETE,
): Promise<void> => {
    const deleteMessage = `remove ${componentName}`
    const message = commitMessagePattern.replace(
        COMMIT_MESSAGE_PLACEHOLDER,
        deleteMessage,
    )
    const { data: results } = await githubApi.repos.getContents({
        ...githubArgs,
        path: componentPath,
        ref: githubArgs.head,
    })
    const promises = Array.isArray(results)
        ? results.map(({ path, sha }) =>
              githubApi.repos.deleteFile({ ...githubArgs, message, path, sha }),
          )
        : [githubApi.repos.deleteFile({ ...githubArgs, ...results, message })]
    await eagerPromises(promises)
}

async function addOrModifyIconFile(
    githubApi: Octokit,
    githubArgs: { head: string; owner: string; repo: string },
    fileName: string,
    filePath: string,
    fileContents: string,
    commitMessagePatternCreate: string = COMMIT_MESSAGE_PATTERNS.CREATE,
    commitMessagePatternUpdate: string = COMMIT_MESSAGE_PATTERNS.UPDATE,
): Promise<void> {
    let fileSha
    try {
        const { data } = await githubApi.repos.getContents({
            ...githubArgs,
            path: filePath,
            ref: githubArgs.head,
        })
        if (Array.isArray(data)) return
        fileSha = data.sha
    } catch (e) {
        // do nothing
    }
    const message = fileSha
        ? commitMessagePatternUpdate.replace(
              COMMIT_MESSAGE_PLACEHOLDER,
              `modify ${fileName}`,
          )
        : commitMessagePatternCreate.replace(
              COMMIT_MESSAGE_PLACEHOLDER,
              `add ${fileName}`,
          )
    await githubApi.repos.createOrUpdateFile({
        ...githubArgs,
        branch: githubArgs.head,
        content: toBase64(fileContents),
        message,
        path: filePath,
        sha: fileSha,
    })
}

export const writeComponent = async ({
    github: { api: githubApi, ...githubArgs },
    ...args
}: {
    code: string
    commitMessagePatterns: {
        create: string
        delete: string
        update: string
    }
    componentName?: string
    componentNameOld?: string
    componentFiles: { [fileName: string]: string }
    diffType: string
    fileExt?: string
    filePath: string
    folderPath: string
    github: {
        api: Octokit
        base: string
        head: string
        owner: string
        repo: string
    }
    logger?: Logger
    outputPath?: string
}): Promise<void> => {
    if (!args.componentName) {
        return args.logger?.warn(
            `No '${STATE.COMPONENT_NAME}' provided for '${args.filePath}'.`,
        )
    }
    if (!args.outputPath) {
        return args.logger?.warn(`No '${OPTIONS.OUTPUT_PATH}' provided.`)
    }
    if (!args.fileExt) {
        args.logger?.warn(`No '${OPTIONS.FILE_EXT}' provided.`)
    }
    // gather files
    const componentFiles = Object.entries(args.componentFiles)
    const singleFile = componentFiles.length === 0
    const pathToFolder = path.join(
        args.folderPath,
        args.outputPath,
        singleFile ? '' : args.componentName,
    )
    const pathToFile = path.join(
        pathToFolder,
        singleFile ? args.componentName : 'index',
    )
    const componentFilePath = args.fileExt
        ? `${pathToFile}.${args.fileExt}`
        : pathToFile
    componentFiles.push([componentFilePath, args.code])
    // commit file changes
    const pendingPromises = []
    if (isRemoved(args.diffType)) {
        pendingPromises.push(
            removeIconFiles(
                githubApi,
                githubArgs,
                args.componentName,
                singleFile ? componentFilePath : pathToFolder,
                args.commitMessagePatterns.delete,
            ),
        )
    } else if (isAdded(args.diffType) || isRenamed(args.diffType)) {
        for (const [fileName, fileContents] of componentFiles) {
            const filePath = path.join(pathToFolder, fileName)
            pendingPromises.push(
                addOrModifyIconFile(
                    githubApi,
                    githubArgs,
                    fileName,
                    filePath,
                    fileContents,
                    args.commitMessagePatterns.create,
                    args.commitMessagePatterns.update,
                ),
            )
        }
        if (isRenamed(args.diffType) && args.componentNameOld) {
            const oldPathToFolder = path.join(
                args.folderPath,
                args.outputPath,
                singleFile ? '' : args.componentNameOld,
            )
            const oldPathToFile = path.join(
                oldPathToFolder,
                singleFile ? args.componentNameOld : 'index',
            )
            const oldComponentFilePath = args.fileExt
                ? `${oldPathToFile}.${args.fileExt}`
                : oldPathToFile
            pendingPromises.push(
                removeIconFiles(
                    githubApi,
                    githubArgs,
                    args.componentNameOld,
                    singleFile ? oldComponentFilePath : oldPathToFolder,
                    args.commitMessagePatterns.delete,
                ),
            )
        }
    }
    await eagerPromises(pendingPromises)
}
