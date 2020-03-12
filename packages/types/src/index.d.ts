// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObject = { [key: string]: any }

declare module '@react-vector-graphics/types' {
    type State = {
        filePath?: string
        componentName?: string
    } & AnyObject

    type PluginParams = { code: string; state: State }

    type PluginResult = string | PluginParams | string[] | PluginParams[]

    type Plugin = (
        svg?: string,
        config?: Configuration,
        state?: State,
    ) => PluginResult

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
