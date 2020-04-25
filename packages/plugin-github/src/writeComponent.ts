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

const isRemoved = (status: string): boolean => status === STATUSES.REMOVED
const isRenamed = (status: string): boolean => status === STATUSES.RENAMED

const removeIconFiles = async (
    githubApi: Octokit,
    githubParams: { head: string; owner: string; repo: string },
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
        ...githubParams,
        path: componentPath,
        ref: githubParams.head,
    })
    const promises = Array.isArray(results)
        ? results.map(({ path, sha }) =>
              githubApi.repos.deleteFile({
                  ...githubParams,
                  message,
                  path,
                  sha,
              }),
          )
        : [githubApi.repos.deleteFile({ ...githubParams, ...results, message })]
    await eagerPromises(promises)
}

const addOrModifyIconFile = async (
    githubApi: Octokit,
    githubParams: { head: string; owner: string; repo: string },
    fileName: string,
    filePath: string,
    fileContents: string,
    commitMessagePatternCreate: string = COMMIT_MESSAGE_PATTERNS.CREATE,
    commitMessagePatternUpdate: string = COMMIT_MESSAGE_PATTERNS.UPDATE,
): Promise<void> => {
    let fileSha
    try {
        const { data } = await githubApi.repos.getContents({
            ...githubParams,
            path: filePath,
            ref: githubParams.head,
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
        ...githubParams,
        branch: githubParams.head,
        content: toBase64(fileContents),
        message,
        path: filePath,
        sha: fileSha,
    })
}

const writeComponent = async ({
    github: { api: githubApi, ...githubParams },
    ...params
}: {
    assetFile: string
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
    // gather files
    const componentFiles = Object.entries(params.componentFiles)
    const singleFile = componentFiles.length === 0
    const pathToFolder = path.join(
        params.folderPath,
        params.outputPath,
        singleFile ? '' : params.componentName,
    )
    const pathToFile = path.join(
        pathToFolder,
        singleFile ? params.componentName : 'index',
    )
    const componentFilePath = params.fileExt
        ? `${pathToFile}.${params.fileExt}`
        : pathToFile
    componentFiles.push([componentFilePath, params.code])
    // commit file changes
    const pendingPromises = []
    if (isRemoved(params.diffType)) {
        pendingPromises.push(
            removeIconFiles(
                githubApi,
                githubParams,
                params.componentName,
                singleFile ? componentFilePath : pathToFolder,
                params.commitMessagePatterns.delete,
            ),
        )
    } else {
        // added, modified or renamed
        for (const [fileName, fileContents] of componentFiles) {
            const filePath = path.join(pathToFolder, fileName)
            pendingPromises.push(
                addOrModifyIconFile(
                    githubApi,
                    githubParams,
                    fileName,
                    filePath,
                    fileContents,
                    params.commitMessagePatterns.create,
                    params.commitMessagePatterns.update,
                ),
            )
        }
        if (isRenamed(params.diffType) && params.componentNameOld) {
            const oldPathToFolder = path.join(
                params.folderPath,
                params.outputPath,
                singleFile ? '' : params.componentNameOld,
            )
            const oldPathToFile = path.join(
                oldPathToFolder,
                singleFile ? params.componentNameOld : 'index',
            )
            const oldComponentFilePath = params.fileExt
                ? `${oldPathToFile}.${params.fileExt}`
                : oldPathToFile
            pendingPromises.push(
                removeIconFiles(
                    githubApi,
                    githubParams,
                    params.componentNameOld,
                    singleFile ? oldComponentFilePath : oldPathToFolder,
                    params.commitMessagePatterns.delete,
                ),
            )
        }
    }
    await eagerPromises(pendingPromises)
}

export default writeComponent
