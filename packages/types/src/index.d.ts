// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObject = { [key: string]: any }

type Log = console.log

declare module '@react-vector-graphics/types' {
    type State = {
        filePath?: string
        componentName?: string
        componentFiles?: { [fileName: string]: string }
    } & AnyObject

    type PluginParams = { code: string; state: State }

    type PluginResult = string | PluginParams | string[] | PluginParams[]

    type Logger = { error: Log; info: Log; warn: Log }

    type Plugin = (
        code: string | undefined,
        config: Configuration,
        state: State,
        logger?: Logger,
    ) => Promise<PluginResult>

    type Configuration = {
        options: AnyObject
        plugins: (string | Plugin)[]
    } & AnyObject

    type NamingScheme =
        | 'CONSTANT_CASE'
        | 'camelCase'
        | 'PascalCase'
        | 'snake_case'
        | 'spinal-case'
}
