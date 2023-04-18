export const OPTIONS = {
    API: `github/api`,
    BASE: `github/base`,
    COMMIT_CREATE_PATTERN: `github/commitCreate`,
    COMMIT_DELETE_PATTERN: `github/commitDelete`,
    COMMIT_UPDATE_PATTERN: `github/commitUpdate`,
    FOLDER_PATH: `github/folderPath`,
    HEAD: `github/head`,
    OWNER: `github/owner`,
    REPO: `github/repo`,
    FILE_EXT: 'assets/fileExt', // @react-vector-graphics/plugin-assets
    GLOB_PATTERN: 'assets/globPattern', // @react-vector-graphics/plugin-assets
    NAME_SCHEME: 'assets/nameScheme', // @react-vector-graphics/plugin-assets
    OUTPUT_PATH: 'assets/outputPath', // @react-vector-graphics/plugin-assets
} as const

export const STATE = {
    COMPONENT_FILES: 'assets/componentFiles', // @react-vector-graphics/plugin-assets
    COMPONENT_NAME: 'componentName', // @svgr/plugin-jsx
    COMPONENT_NAME_OLD: `github/componentNameOld`,
    DIFF_TYPE: `github/diffType`,
    FILE_PATH: 'filePath', // @svgr/plugin-jsx
} as const

export const STATUSES = {
    ADDED: 'added',
    MODIFIED: 'modified',
    REMOVED: 'removed',
    RENAMED: 'renamed',
} as const

export const COMMIT_MESSAGE_PLACEHOLDER = '${message}'

export const COMMIT_MESSAGE_PATTERNS = {
    CREATE: `feat: ${COMMIT_MESSAGE_PLACEHOLDER}`,
    DELETE: `refactor: ${COMMIT_MESSAGE_PLACEHOLDER}\n\nBREAKING CHANGE: ${COMMIT_MESSAGE_PLACEHOLDER}`,
    UPDATE: `fix: ${COMMIT_MESSAGE_PLACEHOLDER}`,
}

export const EMPTY_SVG = '<svg/>'
