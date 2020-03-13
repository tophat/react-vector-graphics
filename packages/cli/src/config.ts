import { cosmiconfig } from 'cosmiconfig'

import { Configuration } from '@react-vector-graphics/types'

export const DEFAULT_CONFIG: Configuration = {
    options: {},
    plugins: [],
}

const cache = process.env.NODE_ENV !== 'test'
const explorer = cosmiconfig('rvg', { cache })

export const loadConfig = async (from?: string): Promise<Configuration> => {
    const result = await explorer.search(from)
    return Object.assign({}, DEFAULT_CONFIG, result?.config)
}
