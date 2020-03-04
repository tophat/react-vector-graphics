// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PluginOptions = { [key: string]: any }
type Configuration = {
    plugins: { options: PluginOptions; path: string }[]
}
interface Plugin {
    discover({ options }: { options: PluginOptions }): Entry[]
}
type PluginConfig = {
    options: PluginOptions
    plugin: Plugin
}
type PluginOutput = { pluginName: string }
type Entry = PluginOutput & { path: string; content: string }
