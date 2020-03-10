import { default as core, loadConfig } from '@svgr/core'

import {
    Configuration,
    Entry,
    FindPlugin,
    State,
} from '@react-vector-graphics/types'

import { resolvePlugin } from './plugins'

export default async function({
    config: { entries = [], svgr = {} },
}: {
    config: Configuration
}): Promise<void> {
    await Promise.all(
        entries.map(async (entry: Entry) => {
            const [assets, svgrConfig] = await Promise.all([
                resolvePlugin(entry.find.plugin).then((find: FindPlugin) => {
                    return find(entry.find.config)
                }),
                loadConfig(Object.assign({}, svgr, entry.svgr)),
            ])
            await Promise.all(
                assets.map(({ svg, state }: { svg: string; state: State }) => {
                    return core(svg, svgrConfig, state)
                }),
            )
        }),
    )
}
