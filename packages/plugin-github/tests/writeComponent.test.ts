import { Octokit } from '@octokit/rest'

import writeComponent from '../src/writeComponent'
import { OPTIONS, STATE } from '../src'

import { mockComponent, mockGithubApi, mockOptions, mockState } from './mocks'

describe('writeComponent', () => {
    const sharedParams = {
        code: mockComponent,
        fileExt: mockOptions[OPTIONS.FILE_EXT] as string,
        folderPath: mockOptions[OPTIONS.FOLDER_PATH] as string,
        github: {
            api: (mockGithubApi as unknown) as Octokit,
            base: mockOptions[OPTIONS.BASE] as string,
            head: mockOptions[OPTIONS.HEAD] as string,
            owner: mockOptions[OPTIONS.OWNER] as string,
            repo: mockOptions[OPTIONS.REPO] as string,
        },
        logger: console,
        outputPath: mockOptions[OPTIONS.OUTPUT_PATH] as string,
    }

    const spyLoggerWarn = jest.spyOn(console, 'warn')

    afterEach(() => {
        jest.resetAllMocks()
        mockGithubApi.repos.createOrUpdateFile.mockReset()
    })
    afterAll(jest.restoreAllMocks)

    it('creates single component file when given code', async () => {
        await writeComponent({
            ...sharedParams,
            assetFile: mockState[STATE.FILE_PATH] as string,
            componentFiles: {},
            componentName: mockState[STATE.COMPONENT_NAME] as string,
            componentNameOld: mockState[STATE.COMPONENT_NAME_OLD] as string,
            diffType: mockState[STATE.DIFF_TYPE] as string,
        })
        expect(mockGithubApi.repos.createOrUpdateFile).toHaveBeenCalledTimes(1)
        expect(mockGithubApi.repos.createOrUpdateFile).toHaveBeenCalledWith({
            base: 'master',
            branch: 'test-branch',
            content:
                'CmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCcKZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbW9ja0ljb24oKSB7CiAgICByZXR1cm4gPHN2Zz5tb2NrIHVwZGF0ZWQ8L3N2Zz4KfQo=',
            head: 'test-branch',
            message: 'feat: add mockIcon mockIcon.js',
            owner: 'mockOwner',
            path: 'packages/mock-package/components/mockIcon.js',
            repo: 'mockRepo',
            sha: undefined,
        })
        expect(spyLoggerWarn).not.toHaveBeenCalled()
    })

    it('writes files to component folder when given extra files', async () => {
        await writeComponent({
            ...sharedParams,
            assetFile: mockState[STATE.FILE_PATH] as string,
            componentFiles: mockState[STATE.COMPONENT_FILES] as AnyObject,
            componentName: mockState[STATE.COMPONENT_NAME] as string,
            componentNameOld: mockState[STATE.COMPONENT_NAME_OLD] as string,
            diffType: mockState[STATE.DIFF_TYPE] as string,
        })
        expect(mockGithubApi.repos.createOrUpdateFile).toHaveBeenCalledWith({
            base: 'master',
            branch: 'test-branch',
            content: 'IyMgbW9ja0ljb24KCm1vY2sgdXNhZ2Ugbm90ZXM=',
            head: 'test-branch',
            message: 'feat: add mockIcon README.md',
            owner: 'mockOwner',
            path: 'packages/mock-package/components/mockIcon/README.md',
            repo: 'mockRepo',
            sha: undefined,
        })
        expect(mockGithubApi.repos.createOrUpdateFile).toHaveBeenCalledWith({
            base: 'master',
            branch: 'test-branch',
            content:
                'CmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCcKZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbW9ja0ljb24oKSB7CiAgICByZXR1cm4gPHN2Zz5tb2NrIHVwZGF0ZWQ8L3N2Zz4KfQo=',
            head: 'test-branch',
            message: 'feat: add mockIcon index.js',
            owner: 'mockOwner',
            path: 'packages/mock-package/components/mockIcon/index.js',
            repo: 'mockRepo',
            sha: undefined,
        })
        expect(spyLoggerWarn).not.toHaveBeenCalled()
    })
})
