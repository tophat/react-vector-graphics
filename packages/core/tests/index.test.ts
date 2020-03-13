import { vol } from 'memfs'
import * as fs from 'fs-extra'

import { Configuration } from '@react-vector-graphics/types'
import {
    OPTIONS,
    default as assetsPlugin,
} from '@react-vector-graphics/plugin-assets'

import rvgCore from '../src'

describe('core', () => {
    const mockConfig = (): Configuration => ({
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
        const outputDir = config.options[OPTIONS.OUTPUT_PATH]
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
        config.plugins.push(invalidPlugin)
        await expect(rvgCore({ config })).rejects.toThrowErrorMatchingSnapshot()
    })
})
