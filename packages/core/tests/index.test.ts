import pluginAssets from '@react-vector-graphics/plugin-assets'

import rvgCore from '../src'

describe('core', () => {
    console.log(pluginAssets)
    const entry = (): Entry => ({
        find: {
            config: { globPattern: '*.svg', outputPath: './' },
            plugin: pluginAssets.default,
        },
    })
    const config = (): Configuration => ({
        dryRun: false,
        entries: [entry()],
        svgrConfig: {},
    })

    it('uses default configuration', async () => {
        expect(await rvgCore({ config: config() })).toMatchInlineSnapshot()
    })
})
