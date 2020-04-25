import * as path from 'path'

import { NamingScheme } from '@react-vector-graphics/types'

const capitalize = (w: string): string =>
    `${w[0].toUpperCase()}${w.slice(1).toLowerCase()}`

const pathToName = (
    filePath: string,
    namingScheme: NamingScheme,
): string | undefined => {
    const words = path
        .basename(filePath, filePath.split('.').pop())
        .match(/[a-zA-Z0-9]+/g)
    switch (namingScheme) {
        case 'CONSTANT_CASE':
            return words?.join('_').toUpperCase()
        case 'snake_case':
            return words?.join('_').toLowerCase()
        case 'spinal-case':
            return words?.join('-').toLowerCase()
        case 'camelCase':
            return words
                ?.map((w, i): string => {
                    return i > 0 ? capitalize(w) : w.toLowerCase()
                })
                .join('')
        case 'PascalCase':
        default:
            return words?.map(capitalize).join('')
    }
}

export default pathToName
