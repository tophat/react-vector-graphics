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

async function addIconFile(
    githubApi: Octokit,
    githubArgs: { head: string; owner: string; repo: string },
    fileName: string,
    filePath: string,
    fileContents: string,
    fileSha?: string,
    commitMessagePattern: string = COMMIT_MESSAGE_PATTERNS.CREATE,
) {
    const createMessage = `add ${fileName}`
    const message = commitMessagePattern.replace(
        COMMIT_MESSAGE_PLACEHOLDER,
        createMessage,
    )
    return githubApi.repos.createOrUpdateFile({
        ...githubArgs,
        branch: githubArgs.head,
        content: toBase64(fileContents),
        message,
        path: filePath,
        sha: fileSha,
    })
}

// async function modifySVGFile(context, icon, branch) {
//     const svgFileContent = await icon.svg.content
//     const optimisedSVG = await optimiseSVG(svgFileContent)
//     if (svgFileContent === optimisedSVG) return
//     await context.github.repos.updateFile(
//         context.repo({
//             branch,
//             content: btoa(optimisedSVG),
//             message: `refactor: optimise ${icon.name} svg`,
//             path: icon.svg.path,
//             sha: icon.svg.sha,
//         }),
//     )
// }

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
    fileSha: string
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
                addIconFile(
                    githubApi,
                    githubArgs,
                    fileName,
                    filePath,
                    args.fileSha,
                    fileContents,
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
        // pendingPromises.push(modifySVGFile(context, icon, ref))
    }
    await eagerPromises(pendingPromises)
}
