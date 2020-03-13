import { vol } from 'memfs'
import * as fs from 'fs-extra'
import * as mockProps from 'jest-mock-props'

import { Configuration } from '@react-vector-graphics/types'
import { OPTIONS } from '@react-vector-graphics/plugin-assets'
import rvgCore from '@react-vector-graphics/core'

import { default as rvgCli } from '../src/index'

jest.mock('@react-vector-graphics/core', () => jest.fn())
mockProps.extend(jest)

describe('cli', () => {
    const spyRvgCore = rvgCore as jest.Mocked<typeof rvgCore>
    const spyProcessArgs = jest.spyOnProp(process, 'argv')
    const spyProcessExit = jest.spyOn(process, 'exit')
    const spyLogError = jest.spyOn(console, 'error')

    const createMockConfig = (config: Configuration): void => {
        fs.outputJSONSync(`${process.cwd()}/.rvgrc.json`, config)
    }

    beforeEach(() => {
        spyProcessExit.mockImplementation(code => {
            throw Error(`Process exited with code: ${code}`)
        })
    })

    afterEach(() => {
        vol.reset()
        jest.resetAllMocks()
    })

    it('requests for missing option: pattern', async () => {
        createMockConfig({
            options: {
                [OPTIONS.OUTPUT_PATH]: 'tests/component',
            },
            plugins: [],
        })
        await expect(rvgCli()).rejects.toThrowErrorMatchingSnapshot()
        expect(spyLogError).toHaveBeenCalledWith(
            'Missing required argument: pattern',
        )
    })

    it('requests for missing option: output', async () => {
        createMockConfig({
            options: {
                [OPTIONS.GLOB_PATTERN]: '*.svg',
            },
            plugins: [],
        })
        await expect(rvgCli()).rejects.toThrowErrorMatchingSnapshot()
        expect(spyLogError).toHaveBeenCalledWith(
            'Missing required argument: output',
        )
    })

    it('runs with combination of supplied options', async () => {
        spyProcessArgs.mockValue([
            'node',
            'test.js',
            '--ext',
            'js',
            '--output',
            'tests/components',
        ])
        createMockConfig({
            options: { [OPTIONS.GLOB_PATTERN]: '*.svg' },
            plugins: [],
        })
        await rvgCli()
        expect(spyLogError).not.toHaveBeenCalled()
        expect(spyRvgCore).toHaveBeenCalledWith({
            config: {
                options: {
                    [OPTIONS.FILE_EXT]: 'js',
                    [OPTIONS.GLOB_PATTERN]: '*.svg',
                    [OPTIONS.OUTPUT_PATH]: 'tests/components',
                },
                plugins: [
                    '@react-vector-graphics/plugin-assets',
                    '@svgr/plugin-jsx',
                    '@react-vector-graphics/plugin-assets',
                ],
            },
        })
    })
})
