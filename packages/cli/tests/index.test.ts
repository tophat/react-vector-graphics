import * as mockProps from 'jest-mock-props'

import { OPTIONS } from '@react-vector-graphics/plugin-assets'
import rvgCore from '@react-vector-graphics/core'

import { run } from '../src/main'

jest.mock('@react-vector-graphics/core', () => jest.fn())
mockProps.extend(jest)

describe('cli', () => {
    const spyRvgCore = rvgCore as jest.Mocked<typeof rvgCore>
    const spyProcessArgs = jest.spyOnProp(process, 'argv')
    const spyProcessExit = jest.spyOn(process, 'exit')
    const spyLogError = jest.spyOn(console, 'error')

    beforeEach(() => {
        spyProcessExit.mockImplementation(code => {
            throw Error(`Process exited with code: ${code}`)
        })
    })

    afterEach(() => {
        jest.resetAllMocks()
    })

    it('requests for missing option: pattern', async () => {
        const config = {
            options: {
                [OPTIONS.OUTPUT_PATH]: 'tests/component',
            },
            plugins: [],
        }
        await expect(run(config)).rejects.toThrowErrorMatchingSnapshot()
        expect(spyLogError).toHaveBeenCalledWith(
            'Missing required argument: pattern',
        )
    })

    it('requests for missing option: output', async () => {
        const config = {
            options: {
                [OPTIONS.GLOB_PATTERN]: '*.svg',
            },
            plugins: [],
        }
        await expect(run(config)).rejects.toThrowErrorMatchingSnapshot()
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
        const config = {
            options: { [OPTIONS.GLOB_PATTERN]: '*.svg' },
            plugins: [],
        }
        await run(config)
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
