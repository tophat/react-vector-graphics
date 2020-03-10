import { cosmiconfig } from 'cosmiconfig'

import { Configuration } from '@react-vector-graphics/types'

export const DEFAULT_CONFIG: Configuration = {
    dryRun: false,
    entries: [],
    svgr: {},
}

const explorer = cosmiconfig('rvg', { cache: true })

export async function loadConfig(): Promise<Configuration> {
    const result = await explorer.search()
    return Object.assign({}, DEFAULT_CONFIG, result?.config)
}
