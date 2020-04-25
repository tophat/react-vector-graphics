import * as path from 'path'

import minimatch from 'minimatch'
import { Octokit } from '@octokit/rest'

import { NamingScheme, PluginParams, State } from '@react-vector-graphics/types'
import { pathToName } from '@react-vector-graphics/utils'

import { STATE } from './constants'
import { fromBase64 } from './utils'

export const findAssets = async ({
    github: { api: githubApi, ...githubArgs },
    ...args
}: {
    folderPath: string
    github: {
        api: Octokit
        base: string
        owner: string
        repo: string
        head: string
    }
    globPattern: string
    nameScheme: NamingScheme
    state: State
}): Promise<PluginParams[]> => {
    const compareCommitsResult = await githubApi.repos.compareCommits(
        githubArgs,
    )
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
                ref: githubArgs.head,
            })
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            const { previous_filename: previousFilename } = file
            return {
                code: fromBase64(getContentResult.data.toString()),
                state: Object.assign(
                    {
                        [STATE.COMPONENT_NAME]: pathToName(
                            filePath,
                            args.nameScheme,
                        ),
                        [STATE.COMPONENT_NAME_OLD]:
                            previousFilename &&
                            pathToName(
                                path.relative(
                                    args.folderPath,
                                    previousFilename,
                                ),
                                args.nameScheme,
                            ),
                        [STATE.DIFF_TYPE]: file.status,
                        [STATE.FILE_PATH]: filePath,
                    },
                    args.state,
                ),
            }
        },
    )
    return Promise.all(pluginParams)
}
