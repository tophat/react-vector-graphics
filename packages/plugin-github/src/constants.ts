const ns = (s: TemplateStringsArray): string => `github/${s}`

export const OPTIONS = {
    API: ns`api`,
    BASE: ns`base`,
    COMMIT_CREATE_PATTERN: ns`commitCreate`,
    COMMIT_DELETE_PATTERN: ns`commitDelete`,
    COMMIT_UPDATE_PATTERN: ns`commitUpdate`,
    FILE_EXT: ns`fileExt`,
    FOLDER_PATH: ns`folderPath`,
    GLOB_PATTERN: ns`globPattern`,
    HEAD: ns`head`,
    NAME_SCHEME: ns`nameScheme`,
    OUTPUT_PATH: ns`outputPath`,
    OWNER: ns`owner`,
    REPO: ns`repo`,
}

export const STATE = {
    COMPONENT_FILES: ns`componentFiles`,
    COMPONENT_NAME: 'componentName', // @svgr/plugin-jsx
    COMPONENT_NAME_OLD: ns`componentNameOld`,
    DIFF_TYPE: ns`diffType`,
    FILE_PATH: 'filePath', // @svgr/plugin-jsx
}

export const STATUSES = {
    ADDED: 'added',
    MODIFIED: 'modified',
    REMOVED: 'removed',
    RENAMED: 'renamed',
}

export const COMMIT_MESSAGE_PLACEHOLDER = '${message}'

export const COMMIT_MESSAGE_PATTERNS = {
    CREATE: `feat: ${COMMIT_MESSAGE_PLACEHOLDER}`,
    DELETE: `refactor: ${COMMIT_MESSAGE_PLACEHOLDER}\nBREAKING CHANGE: ${COMMIT_MESSAGE_PLACEHOLDER}`,
    UPDATE: `fix: ${COMMIT_MESSAGE_PLACEHOLDER}`,
}
