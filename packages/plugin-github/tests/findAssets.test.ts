import { Octokit } from '@octokit/rest'

import { NamingScheme } from '@react-vector-graphics/types'

import findAssets from '../src/findAssets'
import { OPTIONS } from '../src'

import { mockGithubApi, mockOptions } from './mocks'

describe('findAssets', () => {
    it('returns all assets matching pattern', async () => {
        await expect(
            findAssets({
                folderPath: mockOptions[OPTIONS.FOLDER_PATH] as string,
                github: {
                    api: (mockGithubApi as unknown) as Octokit,
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
