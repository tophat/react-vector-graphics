import { Configuration } from '@react-vector-graphics/types'

import rvgCore from '../src'

describe('core', () => {
    const mockConfig = (): Configuration => ({
        options: {
            'assets/globPattern': 'example/**/*.svg',
            'assets/nameScheme': 'PascalCase',
            'assets/outputPath': 'example/components',
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
