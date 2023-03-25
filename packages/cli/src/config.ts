import { cosmiconfig } from 'cosmiconfig'

import type { Config } from '@react-vector-graphics/types'

const cache = process.env.NODE_ENV !== 'test'
const explorer = cosmiconfig('rvg', { cache })

export const init = (): Config => ({
    plugins: [],
})
export const find = explorer.search
export const load = explorer.load
