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
import {
    eagerPromises,
    fromBase64,
    replaceAll,
    toBase64,
    withContent,
} from './utils'

const ensureArray = <T>(o: T | T[]): T[] => (Array.isArray(o) ? o : [o])

const removeIconFiles = async (
    githubApi: Octokit,
    githubParams: { head: string; owner: string; repo: string },
    componentName: string,
    componentPath: string,
    commitMessagePattern: string = COMMIT_MESSAGE_PATTERNS.DELETE,
): Promise<void> => {
    const deleteMessage = `remove ${componentName}`
    const message = replaceAll(
        commitMessagePattern,
        COMMIT_MESSAGE_PLACEHOLDER,
        deleteMessage,
    )
    const { data: results } = await githubApi.repos.getContent({
        owner: githubParams.owner,
        path: componentPath,
        ref: githubParams.head,
        repo: githubParams.repo,
    })
    await eagerPromises(
        ensureArray(results).map(
            ({ path, sha }: { path: string; sha: string }) =>
                githubApi.repos.deleteFile({
                    branch: githubParams.head,
                    message,
                    owner: githubParams.owner,
                    path,
                    repo: githubParams.repo,
                    sha,
                }),
        ),
    )
}

const addOrModifyIconFile = async (
    githubApi: Octokit,
    githubParams: { head: string; owner: string; repo: string },
    componentName: string,
    fileName: string,
    filePath: string,
    fileContents: string,
    commitMessagePatternCreate: string = COMMIT_MESSAGE_PATTERNS.CREATE,
    commitMessagePatternUpdate: string = COMMIT_MESSAGE_PATTERNS.UPDATE,
    logger: Logger = console,
): Promise<void> => {
    let fileSha
    let fileContentsOld
    try {
        const { data } = await githubApi.repos.getContent({
            owner: githubParams.owner,
            path: filePath,
            ref: githubParams.head,
            repo: githubParams.repo,
        })
        if (Array.isArray(data)) {
            return logger.info('Path is folder, skipping', filePath)
        }
        fileSha = data.sha
        fileContentsOld = fromBase64(withContent(data).content.toString())
    } catch (e) {
        logger.error(`${e}: ${filePath}`)
    }
    if (fileContentsOld === fileContents) {
        return logger.info('No changes, skipping file', filePath)
    }
    const message = fileSha
        ? replaceAll(
              commitMessagePatternUpdate,
              COMMIT_MESSAGE_PLACEHOLDER,
              `modify ${componentName} ${path.basename(fileName)}`,
          )
        : replaceAll(
              commitMessagePatternCreate,
              COMMIT_MESSAGE_PLACEHOLDER,
              `add ${componentName} ${path.basename(fileName)}`,
          )
    await githubApi.repos.createOrUpdateFileContents({
        branch: githubParams.head,
        content: toBase64(fileContents),
        message,
        owner: githubParams.owner,
        path: filePath,
        repo: githubParams.repo,
        sha: fileSha,
    })
}

const writeComponent = async ({
    github: { api: githubApi, ...githubParams },
    ...params
}: {
    assetFile: string
    code: string
    commitMessagePatterns?: {
        create?: string
        delete?: string
        update?: string
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
    const componentFileName =
        (singleFile ? params.componentName : 'index') +
        (params.fileExt ? `.${params.fileExt}` : '')
    componentFiles.push([componentFileName, params.code])
    const componentFilePath = path.join(pathToFolder, componentFileName)
    // commit file changes
    const pendingPromises = []
    if (params.diffType === STATUSES.REMOVED) {
        pendingPromises.push(
            removeIconFiles(
                githubApi,
                githubParams,
                params.componentName,
                singleFile ? componentFilePath : pathToFolder,
                params.commitMessagePatterns?.delete,
            ),
        )
    } else {
        // added, modified or renamed
        for (const [fileName, fileContents] of componentFiles) {
            const filePath = path.normalize(path.join(pathToFolder, fileName))
            pendingPromises.push(
                addOrModifyIconFile(
                    githubApi,
                    githubParams,
                    params.componentName,
                    fileName,
                    filePath,
                    fileContents,
                    params.commitMessagePatterns?.create,
                    params.commitMessagePatterns?.update,
                    params.logger,
                ),
            )
        }
        if (params.diffType === STATUSES.RENAMED && params.componentNameOld) {
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
                    params.commitMessagePatterns?.delete,
                ),
            )
        }
    }
    await eagerPromises(pendingPromises)
}

export default writeComponent
