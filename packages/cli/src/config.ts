import { cosmiconfig } from 'cosmiconfig'

import { Configuration } from '@react-vector-graphics/types'

export const DEFAULT: Configuration = {
    dryRun: false,
    entries: [],
    svgrConfig: {},
}

const explorer = cosmiconfig('rvg', { cache: true })

export async function loadConfig(): Promise<Configuration> {
    const result = await explorer.search()
    return Object.assign({}, DEFAULT, result?.config)
}
