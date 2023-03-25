import rvgCore from '@react-vector-graphics/core'
import { OPTIONS } from '@react-vector-graphics/plugin-assets'
import * as fs from 'fs-extra'
import { vol } from 'memfs'

import { default as rvgCli } from '../src/index'

import type { Config, Logger } from '@react-vector-graphics/types'

jest.mock('@react-vector-graphics/core', () => ({
    __esModule: true,
    default: jest.fn(),
    getLogger: (): Logger => console,
}))

describe('cli', () => {
    const spyRvgCore = rvgCore as jest.Mocked<typeof rvgCore>
    const spyProcessExit = jest.spyOn(process, 'exit')
    const spyLogError = jest.spyOn(console, 'error')
    const spyLogInfo = jest.spyOn(console, 'info')

    const createMockConfig = (config: Config, path?: string): void => {
        fs.outputJSONSync(path ?? `${process.cwd()}/.rvgrc.json`, config)
    }

    beforeEach(() => {
        process.argv = ['node']
        spyProcessExit.mockImplementation((code) => {
            throw Error(`Process exited with code: ${code}`)
        })
    })

    afterEach(() => {
        vol.reset()
        jest.resetAllMocks()
    })

    it('requests for missing option: config', async () => {
        await expect(rvgCli()).rejects.toThrow()
        expect(spyLogError).toHaveBeenCalledWith(
            'Missing required argument: config',
        )
    })

    it('uses found config file', async () => {
        createMockConfig(
            {
                options: {
                    [OPTIONS.GLOB_PATTERN]: '*.svg',
                },
                plugins: [],
            },
            `${process.cwd()}/../.rvgrc.json`,
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

    it('uses given config file', async () => {
        const mockConfigFile = 'mockconfigfile.json'
        process.argv = ['node', 'test.js', '--config', mockConfigFile]
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
        await expect(rvgCli()).rejects.toThrow()
        expect(spyLogInfo).toHaveBeenCalledWith(
            expect.stringContaining('No config loaded'),
        )
    })

    it('skips empty config file', async () => {
        const configFile = `${process.cwd()}/.rvgrc.json`
        fs.outputFileSync(configFile, '')
        process.argv = ['node', 'test.js', '--config', configFile]
        await rvgCli()
        expect(spyLogInfo).toHaveBeenCalledWith(
            expect.stringContaining('Skipping empty config'),
        )
        expect(spyRvgCore).toHaveBeenCalledWith(
            expect.objectContaining({
                config: {
                    plugins: [
                        '@react-vector-graphics/plugin-assets',
                        '@svgr/plugin-jsx',
                        '@react-vector-graphics/plugin-assets',
                    ],
                },
                logger: expect.anything(),
            }),
        )
    })
})
