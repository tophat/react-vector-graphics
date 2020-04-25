const ns = (s: TemplateStringsArray): string => `github/${s}`

export const OPTIONS = {
    API: ns`api`,
    BASE: ns`base`,
    FILE_EXT: ns`fileExt`,
    FOLDER_PATH: ns`folderPath`,
    GLOB_PATTERN: ns`globPattern`,
    NAME_SCHEME: ns`nameScheme`,
    OUTPUT_PATH: ns`outputPath`,
    OWNER: ns`owner`,
    REPO: ns`repo`,
    SHA: ns`sha`,
}

export const STATE = {
    COMPONENT_FILES: ns`componentFiles`,
    COMPONENT_NAME: 'componentName', // @svgr/plugin-jsx
    DIFF_TYPE: ns`diffType`,
    FILE_PATH: 'filePath', // @svgr/plugin-jsx
    SHA: ns`sha`,
    STATUS: ns`status`,
}
