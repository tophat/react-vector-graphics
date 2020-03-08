import convert, { loadConfig, loadPlugin } from '@svgr/core'

export default async function({
    config: { dryRun = true, entries = [], svgrConfig = {} },
}: {
    config: Configuration
}): Promise<void> {
    await Promise.all(
        entries.map(async (entry: Entry) => {
            const [assets, svgr] = await Promise.all([
                loadPlugin(entry.find.plugin).then((find: Function) => {
                    return find(entry.find.config)
                }),
                loadConfig(Object.assign({}, svgrConfig, entry.svgr)),
            ])
            await Promise.all(
                assets.map(({ svg, state }: { svg: string; state: State }) => {
                    return convert(svg, svgr, state)
                }),
            )
        }),
    )
}
