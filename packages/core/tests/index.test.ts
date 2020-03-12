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

    it('runs successfully using minimal config', async () => {
        const config = mockConfig()
        const outputDir = config.options[OPTIONS.OUTPUT_PATH]
        fs.removeSync(outputDir)
        expect(fs.existsSync(outputDir)).toBe(false)
        await rvgCore({ config })
        expect(fs.readdirSync(outputDir)).toHaveLength(2)
    })
})
