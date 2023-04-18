import type { ConfigPlugin, Config as CoreConfig, State } from '@svgr/core'

export type ReactVectorGraphicsOptions = {
    // API
    // FOLDER_PATH
    // HEAD
    // OWNER
    // REPO
}

export type Config = Omit<CoreConfig, 'plugins'> & {
    options?: Record<string, unknown>
    plugins?: (ConfigPlugin | Plugin)[]
}
/** @deprecated Use Config instead. */
export type Configuration = Config

export type { State } from '@svgr/core'
export type AnyObject = { [key: string]: any }

export type Log = Console['log']

export type PluginParams = {
    code: string
    state: State
}

export type PluginResult = string | PluginParams | string[] | PluginParams[]

export type Logger = { error: Log; info: Log; warn: Log }

export type Plugin = (
    code: string | undefined,
    config: Config,
    state: Omit<State, 'componentName'> & { componentName?: string },
    logger?: Logger,
) => Promise<PluginResult>

export type NamingScheme =
    | 'CONSTANT_CASE'
    | 'camelCase'
    | 'PascalCase'
    | 'snake_case'
    | 'spinal-case'
