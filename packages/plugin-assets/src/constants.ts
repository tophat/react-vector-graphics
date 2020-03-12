const ns = (s: TemplateStringsArray): string => `assets/${s}`

export const OPTIONS = {
    FILE_EXT: ns`fileExt`,
    GLOB_PATTERN: ns`globPattern`,
    NAME_SCHEME: ns`nameScheme`,
    OUTPUT_PATH: ns`outputPath`,
}

export const STATE = {
    COMPONENT_FILES: ns`componentFiles`,
    COMPONENT_NAME: 'componentName', // @svgr/plugin-jsx
    FILE_PATH: 'filePath', // @svgr/plugin-jsx
}
