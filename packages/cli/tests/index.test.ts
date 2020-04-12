import { vol } from 'memfs'
import * as fs from 'fs-extra'
import * as mockProps from 'jest-mock-props'

import { Configuration, Logger } from '@react-vector-graphics/types'
import { OPTIONS } from '@react-vector-graphics/plugin-assets'
import rvgCore from '@react-vector-graphics/core'

import { default as rvgCli } from '../src/index'

jest.mock('@react-vector-graphics/core', () => ({
    __esModule: true,
    default: jest.fn(),
    getLogger: (): Logger => console,
}))
mockProps.extend(jest)

describe('cli', () => {
    const spyRvgCore = rvgCore as jest.Mocked<typeof rvgCore>
    const spyProcessArgs = jest.spyOnProp(process, 'argv')
    const spyProcessExit = jest.spyOn(process, 'exit')
    const spyLogError = jest.spyOn(console, 'error')
    const spyLogInfo = jest.spyOn(console, 'info')

    const createMockConfig = (config: Configuration, path?: string): void => {
        fs.outputJSONSync(path ?? `${process.cwd()}/.rvgrc.json`, config)
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

    it('requests for missing option: config', async () => {
        await expect(rvgCli()).rejects.toThrowErrorMatchingSnapshot()
        expect(spyLogError).toHaveBeenCalledWith(
            'Missing required argument: config',
        )
    })

    it('uses found config file', async () => {
        createMockConfig({
            options: {
                [OPTIONS.GLOB_PATTERN]: '*.svg',
            },
            plugins: [],
        })
        await rvgCli()
        expect(spyLogError).not.toHaveBeenCalled()
        expect(spyRvgCore).toHaveBeenCalledWith(
            expect.objectContaining({
                config: {
                    options: {
                        [OPTIONS.GLOB_PATTERN]: '*.svg',
                    },
                    plugins: [
                        '@react-vector-graphics/plugin-assets',
                        '@svgr/plugin-jsx',
                        '@react-vector-graphics/plugin-assets',
                    ],
                },
                logger: expect.any(Object),
            }),
        )
    })

    it('uses given config file', async () => {
        const mockConfigFile = 'mockconfigfile.json'
        spyProcessArgs.mockValue([
            'node',
            'test.js',
            '--config',
            mockConfigFile,
        ])
        createMockConfig(
            {
                options: { [OPTIONS.GLOB_PATTERN]: '*.svg' },
                plugins: [],
            },
            mockConfigFile,
        )
        await rvgCli()
        expect(spyLogError).not.toHaveBeenCalled()
        expect(spyRvgCore).toHaveBeenCalledWith(
            expect.objectContaining({
                config: {
                    options: {
                        [OPTIONS.GLOB_PATTERN]: '*.svg',
                    },
                    plugins: [
                        '@react-vector-graphics/plugin-assets',
                        '@svgr/plugin-jsx',
                        '@react-vector-graphics/plugin-assets',
                    ],
                },
                logger: expect.any(Object),
            }),
        )
    })

    it('logs not found config file', async () => {
        await expect(rvgCli()).rejects.toThrowError()
        expect(spyLogInfo).toHaveBeenCalledWith(
            expect.stringContaining('No config loaded'),
        )
    })

    it('skips empty config file', async () => {
        const configFile = `${process.cwd()}/.rvgrc.json`
        fs.outputFileSync(configFile, '')
        spyProcessArgs.mockValue(['node', 'test.js', '--config', configFile])
        await rvgCli()
        expect(spyLogInfo).toHaveBeenCalledWith(
            expect.stringContaining('Skipping empty config'),
        )
        expect(spyRvgCore).toHaveBeenCalledWith(
            expect.objectContaining({
                config: {
                    options: {},
                    plugins: [
                        '@react-vector-graphics/plugin-assets',
                        '@svgr/plugin-jsx',
                        '@react-vector-graphics/plugin-assets',
                    ],
                },
                logger: expect.any(Object),
            }),
        )
    })
})
