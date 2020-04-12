import { cosmiconfig } from 'cosmiconfig'

import { Configuration } from '@react-vector-graphics/types'

const cache = process.env.NODE_ENV !== 'test'
const explorer = cosmiconfig('rvg', { cache })

export const init = (): Configuration => ({
    options: {},
    plugins: [],
})
export const find = explorer.search
export const load = explorer.load
