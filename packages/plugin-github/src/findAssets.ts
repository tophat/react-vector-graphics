import * as path from 'path'

import minimatch from 'minimatch'
import { Octokit } from '@octokit/rest'

import { NamingScheme, PluginParams, State } from '@react-vector-graphics/types'
import { pathToName } from '@react-vector-graphics/utils'

import { STATE } from './constants'
import { fromBase64, normaliseGlob } from './utils'

const findAssets = async ({
    github: { api: githubApi, ...githubParams },
    ...params
}: {
    folderPath: string
    github: {
        api: Octokit
        base: string
        head: string
        owner: string
        repo: string
    }
    globPattern: string
    nameScheme: NamingScheme
    state: State
}): Promise<PluginParams[]> => {
    const compareCommitsResult = await githubApi.repos.compareCommits(
        githubParams,
    )
    const svgFiles = compareCommitsResult.data.files.filter(file => {
        const isInFolder = file.filename.startsWith(params.folderPath)
        if (!isInFolder) return false
        const relPath = path.relative(params.folderPath, file.filename)
        return minimatch(relPath, normaliseGlob(params.globPattern))
    })
    const pluginParams = svgFiles.map(
        async (file): Promise<PluginParams> => {
            const filePath = path.relative(params.folderPath, file.filename)
            const { data } = await githubApi.repos.getContents({
                ...githubParams,
                path: file.filename,
                ref: githubParams.head,
            })
            if (Array.isArray(data) || !data.content) {
                throw new Error(`Could not get contents for ${file.filename}`)
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            const { previous_filename: previousFilename } = file
            return {
                code: fromBase64(data.content.toString()),
                state: Object.assign(
                    {
                        [STATE.COMPONENT_NAME]: pathToName(
                            filePath,
                            params.nameScheme,
                        ),
                        [STATE.COMPONENT_NAME_OLD]:
                            previousFilename &&
                            pathToName(
                                path.relative(
                                    params.folderPath,
                                    previousFilename,
                                ),
                                params.nameScheme,
                            ),
                        [STATE.DIFF_TYPE]: file.status,
                        [STATE.FILE_PATH]: filePath,
                    },
                    params.state,
                ),
            }
        },
    )
    return Promise.all(pluginParams)
}

export default findAssets
