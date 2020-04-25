import { NAMING_SCHEME } from '@react-vector-graphics/utils'

import { OPTIONS, STATE, STATUSES } from '../src'
import { toBase64 } from '../lib/utils'

export const mockSVG = '<svg>mock</svg>'

export const mockState = {
    [STATE.COMPONENT_FILES]: {
        'README.md': '## mockIcon\n\nmock usage notes',
    },
    [STATE.COMPONENT_NAME]: 'mockIcon',
    [STATE.DIFF_TYPE]: STATUSES.ADDED,
    [STATE.FILE_PATH]: 'assets/mock.icon.svg',
}

type GithubParams = {
    base: string
    head: string
    owner: string
    repo: string
}

const checkGithubParams = (params: GithubParams): void => {
    if (!params.base) throw new Error('No github base')
    if (!params.head) throw new Error('No github head')
    if (!params.owner) throw new Error('No github owner')
    if (!params.repo) throw new Error('No github repo')
}

export const mockGithubApi = {
    repos: {
        compareCommits: jest.fn().mockImplementation((params: GithubParams) => {
            checkGithubParams(params)
            return Promise.resolve({
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
                            // eslint-disable-next-line @typescript-eslint/camelcase
                            previous_filename:
                                'packages/mock-package/assets/mock-icon.svg',
                            sha: '24bc215ebfc294383928435b00192f34b6558514',
                            status: 'renamed',
                        },
                    ],
                },
            })
        }),
        createOrUpdateFile: jest
            .fn()
            .mockImplementation((params: GithubParams & AnyObject) => {
                checkGithubParams(params)
                for (const p of ['branch', 'content', 'message', 'path']) {
                    if (!params[p]) throw new Error(`No github ${p}`)
                }
            }),
        getContents: jest.fn().mockImplementation((params: GithubParams) => {
            checkGithubParams(params)
            return Promise.resolve({
                data: toBase64(mockSVG),
                encoding: 'base64',
            })
        }),
    },
}

export const mockOptions = {
    [OPTIONS.API]: {},
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
