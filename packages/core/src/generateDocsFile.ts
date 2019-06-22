import { IconDefinition } from './iconDefinition'

export default function generateDocsFile(icon: IconDefinition): string {
    const mdCodeTag = '```'
    return `<!-- THIS FILE IS AUTO-GENERATED - DO NOT EDIT -->
${mdCodeTag}js
// import { ${icon.pascalCaseName} } from '@thm/fe-icons'

<${icon.pascalCaseName} size="" />
${mdCodeTag}`
}
