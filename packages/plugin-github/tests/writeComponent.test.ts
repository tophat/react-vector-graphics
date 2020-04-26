import { Octokit } from '@octokit/rest'

import { OPTIONS, STATE, STATUSES } from '../src/constants'
import writeComponent from '../src/writeComponent'

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

    const { getContents } = mockGithubApi.repos
    const spyLoggerWarn = jest.spyOn(console, 'warn')
    const spyApiGetContents = jest.spyOn(mockGithubApi.repos, 'getContents')
    jest.spyOn(mockGithubApi.repos, 'createOrUpdateFile')
    jest.spyOn(mockGithubApi.repos, 'deleteFile')
    afterEach(() => {
        jest.clearAllMocks()
        spyApiGetContents.mockImplementation(getContents)
    })
    afterAll(jest.restoreAllMocks)

    it('creates single component file when given code', async () => {
        spyApiGetContents.mockRejectedValue('File does not exist')
        await writeComponent({
            ...sharedParams,
            assetFile: mockState[STATE.FILE_PATH] as string,
            componentFiles: {},
            componentName: mockState[STATE.COMPONENT_NAME] as string,
            diffType: mockState[STATE.DIFF_TYPE] as string,
        })
        expect(mockGithubApi.repos.createOrUpdateFile).toHaveBeenCalledTimes(1)
        expect(mockGithubApi.repos.createOrUpdateFile).toHaveBeenCalledWith({
            branch: 'test-branch',
            content:
                'CmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCcKZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbW9ja0ljb24oKSB7CiAgICByZXR1cm4gPHN2Zz5tb2NrIHVwZGF0ZWQ8L3N2Zz4KfQo=',
            message: 'feat: add mockIcon mockIcon.js',
            owner: 'mockOwner',
            path: 'packages/mock-package/components/mockIcon.js',
            repo: 'mockRepo',
            sha: undefined,
        })
        expect(spyLoggerWarn).not.toHaveBeenCalled()
    })

    it('writes files to component folder when given extra files', async () => {
        spyApiGetContents.mockRejectedValue('File does not exist')
        await writeComponent({
            ...sharedParams,
            assetFile: mockState[STATE.FILE_PATH] as string,
            componentFiles: mockState[STATE.COMPONENT_FILES] as AnyObject,
            componentName: mockState[STATE.COMPONENT_NAME] as string,
            diffType: mockState[STATE.DIFF_TYPE] as string,
        })
        expect(mockGithubApi.repos.createOrUpdateFile).toHaveBeenCalledWith({
            branch: 'test-branch',
            content: 'IyMgbW9ja0ljb24KCm1vY2sgdXNhZ2Ugbm90ZXM=',
            message: 'feat: add mockIcon README.md',
            owner: 'mockOwner',
            path: 'packages/mock-package/components/mockIcon/README.md',
            repo: 'mockRepo',
            sha: undefined,
        })
        expect(mockGithubApi.repos.createOrUpdateFile).toHaveBeenCalledWith({
            branch: 'test-branch',
            content:
                'CmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCcKZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbW9ja0ljb24oKSB7CiAgICByZXR1cm4gPHN2Zz5tb2NrIHVwZGF0ZWQ8L3N2Zz4KfQo=',
            message: 'feat: add mockIcon index.js',
            owner: 'mockOwner',
            path: 'packages/mock-package/components/mockIcon/index.js',
            repo: 'mockRepo',
            sha: undefined,
        })
        expect(spyLoggerWarn).not.toHaveBeenCalled()
    })

    it('refreshes single component file when given code', async () => {
        await writeComponent({
            ...sharedParams,
            assetFile: mockState[STATE.FILE_PATH] as string,
            componentFiles: {},
            componentName: mockState[STATE.COMPONENT_NAME] as string,
            diffType: STATUSES.MODIFIED,
        })
        expect(mockGithubApi.repos.createOrUpdateFile).toHaveBeenCalledTimes(1)
        expect(mockGithubApi.repos.createOrUpdateFile).toHaveBeenCalledWith({
            branch: 'test-branch',
            content:
                'CmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCcKZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbW9ja0ljb24oKSB7CiAgICByZXR1cm4gPHN2Zz5tb2NrIHVwZGF0ZWQ8L3N2Zz4KfQo=',
            message: 'fix: modify mockIcon mockIcon.js',
            owner: 'mockOwner',
            path: 'packages/mock-package/components/mockIcon.js',
            repo: 'mockRepo',
            sha: '07a31f3034976f10d2d12f67c78ae2d51015a917',
        })
        expect(spyLoggerWarn).not.toHaveBeenCalled()
    })

    it('refreshes component files when given extra files', async () => {
        await writeComponent({
            ...sharedParams,
            assetFile: mockState[STATE.FILE_PATH] as string,
            componentFiles: mockState[STATE.COMPONENT_FILES] as AnyObject,
            componentName: mockState[STATE.COMPONENT_NAME] as string,
            diffType: STATUSES.MODIFIED,
        })
        const expectedParams = {
            branch: 'test-branch',
            owner: 'mockOwner',
            repo: 'mockRepo',
            sha: '07a31f3034976f10d2d12f67c78ae2d51015a917',
        }
        expect(mockGithubApi.repos.createOrUpdateFile).toHaveBeenCalledWith({
            ...expectedParams,
            content: 'IyMgbW9ja0ljb24KCm1vY2sgdXNhZ2Ugbm90ZXM=',
            message: 'fix: modify mockIcon README.md',
            path: 'packages/mock-package/components/mockIcon/README.md',
        })
        expect(mockGithubApi.repos.createOrUpdateFile).toHaveBeenCalledWith({
            ...expectedParams,
            content:
                'CmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCcKZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbW9ja0ljb24oKSB7CiAgICByZXR1cm4gPHN2Zz5tb2NrIHVwZGF0ZWQ8L3N2Zz4KfQo=',
            message: 'fix: modify mockIcon index.js',
            path: 'packages/mock-package/components/mockIcon/index.js',
        })
        expect(spyLoggerWarn).not.toHaveBeenCalled()
    })

    it('deletes single component file', async () => {
        spyApiGetContents.mockImplementation(async params => {
            const { path, ...rest } = params
            expect(rest).toEqual({
                owner: 'mockOwner',
                ref: 'test-branch',
                repo: 'mockRepo',
            })
            const { data } = await getContents(params)
            return { data: { ...data, path } }
        })
        await writeComponent({
            ...sharedParams,
            assetFile: mockState[STATE.FILE_PATH] as string,
            componentFiles: {},
            componentName: mockState[STATE.COMPONENT_NAME] as string,
            diffType: STATUSES.REMOVED,
        })
        expect(mockGithubApi.repos.deleteFile).toHaveBeenCalledTimes(1)
        expect(mockGithubApi.repos.deleteFile).toHaveBeenCalledWith({
            branch: 'test-branch',
            message:
                'refactor: remove mockIcon\n\nBREAKING CHANGE: remove mockIcon',
            owner: 'mockOwner',
            path: 'packages/mock-package/components/mockIcon.js',
            repo: 'mockRepo',
            sha: '07a31f3034976f10d2d12f67c78ae2d51015a917',
        })
        expect(spyLoggerWarn).not.toHaveBeenCalled()
    })

    it('deletes all component file', async () => {
        spyApiGetContents.mockImplementation(async params => {
            expect(params).toEqual({
                owner: 'mockOwner',
                path: 'packages/mock-package/components/mockIcon',
                ref: 'test-branch',
                repo: 'mockRepo',
            })
            const { data } = await getContents(params)
            return {
                data: [
                    { ...data, path: `${params.path}/index.js` },
                    { ...data, path: `${params.path}/README.md` },
                ],
            }
        })
        await writeComponent({
            ...sharedParams,
            assetFile: mockState[STATE.FILE_PATH] as string,
            componentFiles: mockState[STATE.COMPONENT_FILES] as AnyObject,
            componentName: mockState[STATE.COMPONENT_NAME] as string,
            diffType: STATUSES.REMOVED,
        })
        expect(mockGithubApi.repos.deleteFile).toHaveBeenCalledTimes(2)
        const expectedParams = {
            branch: 'test-branch',
            message:
                'refactor: remove mockIcon\n\nBREAKING CHANGE: remove mockIcon',
            owner: 'mockOwner',
            repo: 'mockRepo',
            sha: '07a31f3034976f10d2d12f67c78ae2d51015a917',
        }
        expect(mockGithubApi.repos.deleteFile).toHaveBeenCalledWith({
            ...expectedParams,
            path: 'packages/mock-package/components/mockIcon/index.js',
        })
        expect(mockGithubApi.repos.deleteFile).toHaveBeenCalledWith({
            ...expectedParams,
            path: 'packages/mock-package/components/mockIcon/README.md',
        })
        expect(spyLoggerWarn).not.toHaveBeenCalled()
    })

    it('deletes and updates renamed component files', async () => {
        spyApiGetContents.mockImplementation(async params => {
            const { path, ...rest } = params
            expect(rest).toEqual({
                owner: 'mockOwner',
                ref: 'test-branch',
                repo: 'mockRepo',
            })
            const { data } = await getContents(params)
            return { data: { ...data, path } }
        })
        await writeComponent({
            ...sharedParams,
            assetFile: mockState[STATE.FILE_PATH] as string,
            componentFiles: {},
            componentName: mockState[STATE.COMPONENT_NAME] as string,
            componentNameOld: 'mockIconOld',
            diffType: STATUSES.RENAMED,
        })
        const expectedParams = {
            branch: 'test-branch',
            owner: 'mockOwner',
            repo: 'mockRepo',
        }
        expect(mockGithubApi.repos.createOrUpdateFile).toHaveBeenCalledTimes(1)
        expect(mockGithubApi.repos.createOrUpdateFile).toHaveBeenCalledWith({
            ...expectedParams,
            content:
                'CmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCcKZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbW9ja0ljb24oKSB7CiAgICByZXR1cm4gPHN2Zz5tb2NrIHVwZGF0ZWQ8L3N2Zz4KfQo=',
            message: 'fix: modify mockIcon mockIcon.js',
            path: 'packages/mock-package/components/mockIcon.js',
            sha: '07a31f3034976f10d2d12f67c78ae2d51015a917',
        })
        expect(mockGithubApi.repos.deleteFile).toHaveBeenCalledTimes(1)
        expect(mockGithubApi.repos.deleteFile).toHaveBeenCalledWith({
            ...expectedParams,
            message:
                'refactor: remove mockIconOld\n\nBREAKING CHANGE: remove mockIconOld',
            path: 'packages/mock-package/components/mockIconOld.js',
            sha: '07a31f3034976f10d2d12f67c78ae2d51015a917',
        })
        expect(spyLoggerWarn).not.toHaveBeenCalled()
    })

    it('warns and continues when fileExt is not provided', async () => {
        await writeComponent({
            ...sharedParams,
            assetFile: mockState[STATE.FILE_PATH] as string,
            componentFiles: {},
            componentName: mockState[STATE.COMPONENT_NAME] as string,
            diffType: mockState[STATE.DIFF_TYPE] as string,
            fileExt: undefined,
        })
        expect(mockGithubApi.repos.createOrUpdateFile).toHaveBeenCalledTimes(1)
        expect(mockGithubApi.repos.createOrUpdateFile).toHaveBeenCalledWith({
            branch: 'test-branch',
            content:
                'CmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCcKZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbW9ja0ljb24oKSB7CiAgICByZXR1cm4gPHN2Zz5tb2NrIHVwZGF0ZWQ8L3N2Zz4KfQo=',
            message: 'fix: modify mockIcon mockIcon',
            owner: 'mockOwner',
            path: 'packages/mock-package/components/mockIcon',
            repo: 'mockRepo',
            sha: '07a31f3034976f10d2d12f67c78ae2d51015a917',
        })
        expect(spyLoggerWarn).toHaveBeenCalledWith(
            `No '${OPTIONS.FILE_EXT}' provided.`,
        )
    })

    it('warns and exits when componentName is not provided', async () => {
        await writeComponent({
            ...sharedParams,
            assetFile: mockState[STATE.FILE_PATH] as string,
            componentFiles: {},
            diffType: mockState[STATE.DIFF_TYPE] as string,
        })
        expect(mockGithubApi.repos.createOrUpdateFile).not.toHaveBeenCalled()
        expect(spyLoggerWarn).toHaveBeenCalledWith(
            "No 'componentName' provided for 'assets/mock.icon.svg'.",
        )
    })

    it('warns and exits when outputPath is not provided', async () => {
        await writeComponent({
            ...sharedParams,
            assetFile: mockState[STATE.FILE_PATH] as string,
            componentFiles: {},
            componentName: mockState[STATE.COMPONENT_NAME] as string,
            diffType: mockState[STATE.DIFF_TYPE] as string,
            outputPath: undefined,
        })
        expect(mockGithubApi.repos.createOrUpdateFile).not.toHaveBeenCalled()
        expect(spyLoggerWarn).toHaveBeenCalledWith(
            `No '${OPTIONS.OUTPUT_PATH}' provided.`,
        )
    })
})
