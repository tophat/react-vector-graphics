import { cosmiconfig } from 'cosmiconfig'

import { Configuration } from '@react-vector-graphics/types'

const DEFAULT_CONFIG: Configuration = {
    options: {},
    plugins: [],
}

const cache = process.env.NODE_ENV !== 'test'
const explorer = cosmiconfig('rvg', { cache })

const withDefault = (config: Partial<Configuration> | null): Configuration =>
    Object.assign({}, DEFAULT_CONFIG, config)

export const findConfig = async (from?: string): Promise<Configuration> =>
    withDefault((await explorer.search(from))?.config)

export const loadConfig = async (from: string): Promise<Configuration> =>
    withDefault((await explorer.load(from))?.config)
