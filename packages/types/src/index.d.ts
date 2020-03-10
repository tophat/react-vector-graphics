declare module '@react-vector-graphics/types' {
    type State = {
        filePath?: string
        outputPath?: string
        componentName?: string
    }

    type Asset = { svg: string; state: State }

    type FindPlugin = (config: Partial<FindPluginConfiguration>) => Asset[]

    type FindPluginConfiguration = {
        globPattern: string
        outputPath: string
    }

    type SVGRConfiguration = {}

    type Entry = {
        find: {
            plugin: FindPlugin | string
            config: Partial<FindPluginConfiguration>
        }
        svgr?: SVGRConfiguration
    }

    type Configuration = {
        dryRun: boolean
        entries: Entry[]
        svgr?: SVGRConfiguration
    }
}
