import { Configuration } from '@react-vector-graphics/types'
import { OPTIONS } from '@react-vector-graphics/plugin-assets'

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
            '@react-vector-graphics/plugin-assets',
        ],
    })

    it('runs successfully using minimal config', async () => {
        const result = await rvgCore({ config: mockConfig() })
        await expect(result).toBeUndefined()
    })
})
