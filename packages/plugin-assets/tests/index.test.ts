import * as path from 'path'

import { fs, vol } from 'memfs'

import { Configuration, State } from '@react-vector-graphics/types'

import { OPTIONS, STATE, default as assetsPlugin } from '../src'

describe('plugin-assets', () => {
    const mockSVGContent = '<svg></svg>'
    const mockFilePath = 'example/assets/file3.svg'
    const mockComponentPascalName = 'File3'
    const spyLogWarn = jest.spyOn(console, 'warn')

    beforeEach(() => {
        vol.fromJSON({
            'example/assets/file-1.24x24.icon.svg': mockSVGContent,
            'example/assets/file2.icon.svg': mockSVGContent,
            [mockFilePath]: mockSVGContent,
        })
    })

    afterEach(() => {
        jest.resetAllMocks()
        vol.reset()
    })

    it('finds all files matching pattern', async () => {
        const config: Configuration = {
            options: {
                [OPTIONS.GLOB_PATTERN]: 'example/assets/*.icon.svg',
            },
            plugins: [],
        }
        expect(
            await assetsPlugin(undefined, config, {}, console),
        ).toMatchSnapshot()
    })

    it('uses supplied naming scheme', async () => {
        const config: Configuration = {
            options: {
                [OPTIONS.GLOB_PATTERN]: 'example/**/*.svg',
                [OPTIONS.NAME_SCHEME]: 'snake_case',
            },
            plugins: [],
        }
        expect(
            await assetsPlugin(undefined, config, {}, console),
        ).toMatchSnapshot()
    })

    it('writes single component file when given code', async () => {
        const fileExt = 'js'
        const outputPath = 'example/components'
        const pathToFile = path.join(
            outputPath,
            `${mockComponentPascalName}.${fileExt}`,
        )
        const state: State = {
            [STATE.FILE_PATH]: mockFilePath,
            [STATE.COMPONENT_NAME]: mockComponentPascalName,
        }
        const config: Configuration = {
            options: {
                [OPTIONS.FILE_EXT]: fileExt,
                [OPTIONS.OUTPUT_PATH]: outputPath,
            },
            plugins: [],
        }

        expect(fs.existsSync(pathToFile)).toBe(false)
        await assetsPlugin(mockSVGContent, config, state, console)
        expect(fs.readFileSync(pathToFile).toString()).toEqual(mockSVGContent)
        expect(spyLogWarn).not.toHaveBeenCalled()
    })

    it('writes files to component folder when given extra files', async () => {
        const fileExt = 'js'
        const outputPath = 'example/components'
        const mockFileName = `index.${fileExt}`
        const mockExtraFileName = `README.md`
        const mockExtraFileContent = `# ${mockComponentPascalName}`
        const pathToFolder = path.join(outputPath, mockComponentPascalName)
        const pathToIndexFile = path.join(pathToFolder, mockFileName)
        const pathToExtraFile = path.join(pathToFolder, mockExtraFileName)
        const state: State = {
            [STATE.FILE_PATH]: mockFilePath,
            [STATE.COMPONENT_NAME]: mockComponentPascalName,
            [STATE.COMPONENT_FILES]: {
                [mockExtraFileName]: mockExtraFileContent,
            },
        }
        const config: Configuration = {
            options: {
                [OPTIONS.FILE_EXT]: fileExt,
                [OPTIONS.OUTPUT_PATH]: outputPath,
            },
            plugins: [],
        }

        expect(fs.existsSync(pathToIndexFile)).toBe(false)
        expect(fs.existsSync(pathToExtraFile)).toBe(false)
        await assetsPlugin(mockSVGContent, config, state, console)
        expect(fs.existsSync(pathToIndexFile)).toBe(true)
        expect(fs.readFileSync(pathToExtraFile).toString()).toEqual(
            mockExtraFileContent,
        )
        expect(spyLogWarn).not.toHaveBeenCalled()
    })

    it('warns and continues when fileExt is not provided', async () => {
        const outputPath = 'example/components'
        const pathToFile = path.join(outputPath, mockComponentPascalName)
        const state: State = {
            [STATE.FILE_PATH]: mockFilePath,
            [STATE.COMPONENT_NAME]: mockComponentPascalName,
        }
        const config: Configuration = {
            options: {
                [OPTIONS.OUTPUT_PATH]: outputPath,
            },
            plugins: [],
        }

        expect(fs.existsSync(pathToFile)).toBe(false)
        await assetsPlugin(mockSVGContent, config, state, console)
        expect(fs.readFileSync(pathToFile).toString()).toEqual(mockSVGContent)
        expect(spyLogWarn).toHaveBeenCalled()
        expect(spyLogWarn.mock.calls[0][0]).toMatchSnapshot()
    })

    it('warns and exits when componentName is not provided', async () => {
        const fileExt = 'js'
        const outputPath = 'example/components'
        const pathToFile = path.join(
            outputPath,
            `${mockComponentPascalName}.${fileExt}`,
        )
        const state: State = {
            [STATE.FILE_PATH]: mockFilePath,
        }
        const config: Configuration = {
            options: {
                [OPTIONS.FILE_EXT]: fileExt,
                [OPTIONS.OUTPUT_PATH]: outputPath,
            },
            plugins: [],
        }

        expect(fs.existsSync(pathToFile)).toBe(false)
        await assetsPlugin(mockSVGContent, config, state, console)
        expect(fs.existsSync(pathToFile)).toBe(false)
        expect(spyLogWarn).toHaveBeenCalled()
        expect(spyLogWarn.mock.calls[0][0]).toMatchSnapshot()
    })

    it('warns and exits when outputPath is not provided', async () => {
        const fileExt = 'js'
        const state: State = {
            [STATE.FILE_PATH]: mockFilePath,
            [STATE.COMPONENT_NAME]: mockComponentPascalName,
        }
        const config: Configuration = {
            options: {
                [OPTIONS.FILE_EXT]: fileExt,
            },
            plugins: [],
        }

        await assetsPlugin(mockSVGContent, config, state, console)
        expect(spyLogWarn).toHaveBeenCalled()
        expect(spyLogWarn.mock.calls[0][0]).toMatchSnapshot()
    })
})
