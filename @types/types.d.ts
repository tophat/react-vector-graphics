type SVGRConfiguration = {}
type State = {
    filePath?: string
    outputPath?: string
    componentName?: string
}
type Entry = {
    find: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        plugin: (config: any) => string | string
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        config: any
    }
    svgr: SVGRConfiguration
}
type Configuration = {
    dryRun: boolean
    entries: Entry[]
    svgrConfig: SVGRConfiguration
}
