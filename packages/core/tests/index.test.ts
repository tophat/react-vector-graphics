import { Configuration, Entry } from '@react-vector-graphics/types'

import rvgCore from '../src'

describe('core', () => {
    const mockEntry = (): Entry => ({
        find: {
            config: {
                globPattern: 'example/**/*.svg',
                outputPath: 'example/components',
            },
            plugin: '@react-vector-graphics/plugin-assets',
        },
    })
    const mockConfig = (): Configuration => ({
        dryRun: false,
        entries: [mockEntry()],
        svgr: {
            plugins: ['@svgr/plugin-jsx'],
        },
    })

    it('runs successfully using minimal config', async () => {
        await expect(rvgCore({ config: mockConfig() })).resolves.toBeUndefined()
    })
})
