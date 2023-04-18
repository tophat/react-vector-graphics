import { NAMING_SCHEME } from '@react-vector-graphics/utils'

import { OPTIONS, PluginGitHubOptions, STATE, STATUSES } from '../src'
import { toBase64 } from '../src/utils'

import type { State } from '@svgr/core'

export const mockSVG = '<svg>mock</svg>'

export const mockState: Partial<State> = {
    // @ts-expect-error todo
    [STATE.COMPONENT_FILES]: {
        'README.md': '## mockIcon\n\nmock usage notes',
    },
    [STATE.COMPONENT_NAME]: 'mockIcon',
    [STATE.DIFF_TYPE]: STATUSES.ADDED,
    [STATE.FILE_PATH]: 'assets/mock.icon.svg',
}

type GithubParams = {
    path: string
    base: string
    head: string
    owner: string
    repo: string
}

const checkGithubParams = (params: GithubParams): void => {
    if (!params.owner) throw new Error('No github owner')
    if (!params.repo) throw new Error('No github repo')
}

export const mockGithubApi = {
    repos: {
        compareCommits: async (params: GithubParams): Promise<unknown> => {
            checkGithubParams(params)
            return {
                data: {
                    files: [
                        {
                            additions: 113,
                            changes: 0,
                            deletions: 0,
                            filename: 'some-file-we-do-not-care-about.js',
                            sha: '29ffd9ac0f6c2fdee9bce8b5ad93ad0d4997ff73',
                            status: 'added',
                        },
                        {
                            additions: 1,
                            changes: 0,
                            deletions: 0,
                            filename:
                                'packages/mock-package/assets/mock-icon-3.svg',
                            sha: 'f0c8c563f5df16ee8fe81cbeaf769dd179cd84e0',
                            status: 'added',
                        },
                        {
                            additions: 0,
                            changes: 1,
                            deletions: 0,
                            filename:
                                'packages/mock-package/assets/mock-icon-2.svg',
                            sha: '1836904bef3587c141afd298693892a41ac37a9e',
                            status: 'modified',
                        },
                        {
                            additions: 0,
                            changes: 0,
                            deletions: 1,
                            filename:
                                'packages/mock-package/assets/mock.icon.svg',
                            sha: '072fd471297e8501713aef834891726e3435ca58',
                            status: 'removed',
                        },
                        {
                            additions: 0,
                            changes: 0,
                            deletions: 0,
                            filename:
                                'packages/mock-package/assets/mock-icon-1.svg',
                            previous_filename:
                                'packages/mock-package/assets/mock-icon.svg',
                            sha: '24bc215ebfc294383928435b00192f34b6558514',
                            status: 'renamed',
                        },
                    ],
                },
            }
        },
        createOrUpdateFileContents: async (
            params: GithubParams,
        ): Promise<void> => {
            checkGithubParams(params)
            for (const p of ['branch', 'content', 'message', 'path']) {
                if (!params[p as keyof typeof params])
                    throw new Error(`CreateOrUpdate: No github ${p}`)
            }
        },
        deleteFile: async (params: GithubParams): Promise<void> => {
            checkGithubParams(params)
            for (const p of ['branch', 'message', 'path', 'sha']) {
                if (!params[p as keyof typeof params])
                    throw new Error(`Delete: No github ${p}`)
            }
        },
        getContent: async (params: GithubParams): Promise<unknown> => {
            checkGithubParams(params)
            for (const p of ['path', 'ref']) {
                if (!params[p as keyof typeof params])
                    throw new Error(`Read: No github ${p}`)
            }
            return {
                data: {
                    content: toBase64(mockSVG),
                    encoding: 'base64',
                    sha: '07a31f3034976f10d2d12f67c78ae2d51015a917',
                },
            }
        },
    },
}

export const mockOptions: PluginGitHubOptions = {
    [OPTIONS.API]: {} as any,
    [OPTIONS.BASE]: 'master',
    [OPTIONS.FILE_EXT]: 'js',
    [OPTIONS.FOLDER_PATH]: 'packages/mock-package',
    [OPTIONS.GLOB_PATTERN]: './assets/*.svg',
    [OPTIONS.HEAD]: 'test-branch',
    [OPTIONS.NAME_SCHEME]: NAMING_SCHEME.CAMEL,
    [OPTIONS.OUTPUT_PATH]: './components',
    [OPTIONS.OWNER]: 'mockOwner',
    [OPTIONS.REPO]: 'mockRepo',
}

export const mockComponent = `
import React from 'react'
export default function mockIcon() {
    return <svg>mock updated</svg>
}
`
