import {
    OPTIONS,
    default as assetsPlugin,
} from '@react-vector-graphics/plugin-assets'
import * as fs from 'fs-extra'
import { vol } from 'memfs'

import rvgCore, { getLogger } from '../src'

import type { Config } from '@react-vector-graphics/types'

describe('core', () => {
    const logger = getLogger()
    const spyLogInfo = jest.spyOn(logger, 'info')
    const mockConfig = (): Config => ({
        options: {
            [OPTIONS.FILE_EXT]: 'jsx',
            [OPTIONS.GLOB_PATTERN]: 'example/**/*.svg',
            [OPTIONS.NAME_SCHEME]: 'PascalCase',
            [OPTIONS.OUTPUT_PATH]: 'example/components',
        },
        plugins: [
            '@react-vector-graphics/plugin-assets',
            '@svgr/plugin-jsx',
            assetsPlugin,
        ],
    })
    const mockSVGContent = '<svg></svg>'

    beforeEach(() => {
        vol.fromJSON({
            'example/assets/file1.icon.svg': mockSVGContent,
            'example/assets/file2.icon.svg': mockSVGContent,
        })
    })

    afterEach(() => {
        jest.resetAllMocks()
        vol.reset()
    })

    it('runs successfully using minimal config', async () => {
        const config = mockConfig()
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const outputDir = config.options![OPTIONS.OUTPUT_PATH] as string
        fs.removeSync(outputDir)
        expect(fs.existsSync(outputDir)).toBe(false)
        await rvgCore({ config })
        expect(fs.readdirSync(outputDir)).toHaveLength(2)
    })

    it.each`
        invalidPlugin
        ${'some-invalid-plugin'}
        ${420}
        ${{}}
    `('fails on invalid plugin: $invalidPlugin', async ({ invalidPlugin }) => {
        const config = mockConfig()
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        config.plugins!.push(invalidPlugin)
        await expect(rvgCore({ config, logger })).rejects.toThrow(
            /(Invalid plugin)|(Cannot find module)/,
        )
        expect(spyLogInfo).toHaveBeenCalled()
    })
})
