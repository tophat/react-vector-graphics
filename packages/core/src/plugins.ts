export class Plugins {
    private pluginConfigs: PluginConfig[] = []

    constructor({ pluginConfigs }: { pluginConfigs: PluginConfig[] }) {
        this.pluginConfigs = pluginConfigs
    }

    discover(): Entry[] {
        const discoveredEntries: Entry[] = []
        for (const { options, plugin } of this.pluginConfigs) {
            const discovered = plugin.discover?.({ options }) ?? []
            for (const entry of discovered) {
                if (this.validateDiscovered(entry)) {
                    discoveredEntries.push(entry)
                }
            }
        }
        return discoveredEntries
    }

    validateDiscovered(entry: Entry): boolean {
        return Boolean(entry.pluginName && entry.path)
    }
}

export const loadPlugins = async ({
    config: { plugins },
}: {
    config: Configuration
}): Promise<Plugins> => {
    const pluginConfigs: PluginConfig[] = []
    for (const { options, path } of plugins) {
        const plugin = await import(path)
        pluginConfigs.push({ options, plugin })
    }
    return new Plugins({ pluginConfigs })
}
