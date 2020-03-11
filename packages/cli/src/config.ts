import { cosmiconfig } from 'cosmiconfig'

import { Configuration } from '@react-vector-graphics/types'

export const DEFAULT_CONFIG: Configuration = {
    options: {},
    plugins: [],
}

const explorer = cosmiconfig('rvg', { cache: true })

export const loadConfig = async (): Promise<Configuration> => {
    const result = await explorer.search()
    return Object.assign({}, DEFAULT_CONFIG, result?.config)
}
