const ICON_FILENAME_REGEX = /^([a-z0-9-]+)(\.(\d+)x\d+)?\.icon\.svg$/

export interface IconDefinition {
    contents: string
    filename: string
    name: string
    pascalCaseName: string
    size?: number
}

function capitalize(word: string): string {
    return `${word.substring(0, 1).toUpperCase()}${word.substring(1)}`
}

function spinalToPascalCase(name: string): string {
    const spinalRegex = /([a-z0-9]+)-?/g
    return name.replace(spinalRegex, (_, spine): string => capitalize(spine))
}

export function createIconDefinition(
    filename: string,
    contents: string,
): IconDefinition {
    const result = filename.match(ICON_FILENAME_REGEX)
    if (!result) {
        throw new Error('Does not match required pattern')
    }
    const [, name, , size] = result
    return {
        contents: contents,
        filename: filename,
        name: name,
        pascalCaseName: `${spinalToPascalCase(name)}Icon${size || ''}`,
        size: size ? Number(size) : undefined,
    }
}
