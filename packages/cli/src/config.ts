import { cosmiconfig } from 'cosmiconfig'

export const DEFAULT: Configuration = {
    dryRun: false,
    entries: [],
    svgrConfig: {},
}

const explorer = cosmiconfig('rvg', {
    cache: true,
    rcExtensions: true,
    sync: true,
})

export async function loadConfig(): Configuration {
    const result = await explorer.search()
    return Object.assign({}, DEFAULT, result?.config)
}
