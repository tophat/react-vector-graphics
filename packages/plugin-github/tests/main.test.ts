import * as findAssets from '../src/findAssets'
import * as writeComponent from '../src/writeComponent'
import { OPTIONS, STATE } from '../src/constants'
import { run } from '../src/main'

import { mockComponent, mockOptions, mockSVG, mockState } from './mocks'

describe('main', () => {
    beforeAll(() => {
        jest.spyOn(findAssets, 'default').mockResolvedValue([
            {
                code: mockSVG,
                state: {
                    ...mockState,
                    [STATE.COMPONENT_FILES]: {},
                },
            },
        ])
        jest.spyOn(writeComponent, 'default').mockResolvedValue()
    })
    afterEach(jest.resetAllMocks)
    afterAll(jest.restoreAllMocks)

    it('finds assets if no code passed', async () => {
        const results = run(
            undefined,
            { options: mockOptions, plugins: [] },
            {},
            console,
        )
        await expect(results).resolves.toMatchSnapshot()
    })

    it('writes component files when code passed', async () => {
        const results = run(
            mockComponent,
            { options: mockOptions, plugins: [] },
            mockState,
            console,
        )
        await expect(results).resolves.toMatchSnapshot()
        expect(writeComponent.default).toHaveBeenCalledWith({
            assetFile: mockState[STATE.FILE_PATH],
            code: mockComponent,
            commitMessagePatterns: {
                create: mockOptions[OPTIONS.COMMIT_CREATE_PATTERN],
                delete: mockOptions[OPTIONS.COMMIT_DELETE_PATTERN],
                update: mockOptions[OPTIONS.COMMIT_UPDATE_PATTERN],
            },
            componentFiles: mockState[STATE.COMPONENT_FILES],
            componentName: mockState[STATE.COMPONENT_NAME],
            componentNameOld: mockState[STATE.COMPONENT_NAME_OLD],
            diffType: mockState[STATE.DIFF_TYPE],
            fileExt: mockOptions[OPTIONS.FILE_EXT],
            folderPath: mockOptions[OPTIONS.FOLDER_PATH],
            github: {
                api: mockOptions[OPTIONS.API],
                base: mockOptions[OPTIONS.BASE],
                head: mockOptions[OPTIONS.HEAD],
                owner: mockOptions[OPTIONS.OWNER],
                repo: mockOptions[OPTIONS.REPO],
            },
            logger: console,
            outputPath: mockOptions[OPTIONS.OUTPUT_PATH],
        })
    })
})
