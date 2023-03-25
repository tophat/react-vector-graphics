import { OPTIONS } from '../src'
import findAssets from '../src/findAssets'

import { mockGithubApi, mockOptions } from './mocks'

import type { Octokit } from '@octokit/rest'
import type { NamingScheme } from '@react-vector-graphics/types'

describe('findAssets', () => {
    it('returns all assets matching pattern', async () => {
        await expect(
            findAssets({
                folderPath: mockOptions[OPTIONS.FOLDER_PATH] as string,
                github: {
                    api: mockGithubApi as unknown as Octokit,
                    base: mockOptions[OPTIONS.BASE] as string,
                    head: mockOptions[OPTIONS.HEAD] as string,
                    owner: mockOptions[OPTIONS.OWNER] as string,
                    repo: mockOptions[OPTIONS.REPO] as string,
                },
                globPattern: mockOptions[OPTIONS.GLOB_PATTERN] as string,
                nameScheme: mockOptions[OPTIONS.NAME_SCHEME] as NamingScheme,
                state: {},
            }),
        ).resolves.toMatchSnapshot()
    })
})
