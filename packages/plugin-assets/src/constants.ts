export const OPTIONS = {
    FILE_EXT: 'assets/fileExt',
    GLOB_PATTERN: 'assets/globPattern',
    NAME_SCHEME: 'assets/nameScheme',
    OUTPUT_PATH: 'assets/outputPath',
} as const

export const STATE = {
    COMPONENT_FILES: 'assets/componentFiles',
    COMPONENT_NAME: 'componentName', // @svgr/plugin-jsx
    FILE_PATH: 'filePath', // @svgr/plugin-jsx
} as const
