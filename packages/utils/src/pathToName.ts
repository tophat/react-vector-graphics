import * as path from 'path'

import { type NamingScheme } from '@react-vector-graphics/types'

const capitalize = (w: string): string =>
    `${w[0].toUpperCase()}${w.slice(1).toLowerCase()}`

export const NAMING_SCHEME: { [key: string]: NamingScheme } = {
    CAMEL: 'camelCase',
    CONSTANT: 'CONSTANT_CASE',
    PASCAL: 'PascalCase',
    SNAKE: 'snake_case',
    SPINAL: 'spinal-case',
}

export const pathToName = (
    filePath: string,
    namingScheme: NamingScheme,
): string | undefined => {
    const words = path
        .basename(filePath, filePath.split('.').pop())
        .match(/[a-zA-Z0-9]+/g)
    switch (namingScheme) {
        case NAMING_SCHEME.CONSTANT:
            return words?.join('_').toUpperCase()
        case NAMING_SCHEME.SNAKE:
            return words?.join('_').toLowerCase()
        case NAMING_SCHEME.SPINAL:
            return words?.join('-').toLowerCase()
        case NAMING_SCHEME.CAMEL:
            return words
                ?.map((w, i): string => {
                    return i > 0 ? capitalize(w) : w.toLowerCase()
                })
                .join('')
        case NAMING_SCHEME.PASCAL:
        default:
            return words?.map(capitalize).join('')
    }
}

export default pathToName
