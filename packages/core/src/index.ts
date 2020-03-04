import { Plugins, loadPlugins } from './plugins'

async function run({ plugins }: { plugins: Plugins }): Promise<void> {
    const entries = await plugins.discover()
    // const outputs = await plugins.generate({ entries })
    // const actions = await plugins.transform({ outputs })
    // await plugins.finalize({ actions })
}

export default async function({
    config,
}: {
    config: Configuration
}): Promise<void> {
    const plugins = await loadPlugins({ config })
    await run({ plugins })
}
