declare module '@react-vector-graphics/types' {
    type State = {
        filePath?: string
        outputPath?: string
        componentName?: string
    }

    type Asset = { svg: string; state: State }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type FindPlugin = (...args: any) => Asset[]

    type FindPluginConfiguration = { globPattern: string; outputPath: string }

    type SVGRConfiguration = {}

    type Entry = {
        find: {
            plugin: FindPlugin | string
            config: FindPluginConfiguration
        }
        svgr?: SVGRConfiguration
    }

    type Configuration = {
        dryRun: boolean
        entries: Entry[]
        svgrConfig: SVGRConfiguration
    }
}
