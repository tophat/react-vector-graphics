import { Plugin } from '@react-vector-graphics/types'

import { OPTIONS, STATE } from './constants'
import { findAssets } from './findAssets'
import { writeComponent } from './writeComponent'

export const run: Plugin = async (code, config, state, logger) => {
    const github = {
        api: config.options[OPTIONS.API],
        base: config.options[OPTIONS.BASE],
        head: config.options[OPTIONS.HEAD],
        owner: config.options[OPTIONS.OWNER],
        repo: config.options[OPTIONS.REPO],
    }
    const sharedArgs = {
        folderPath: config.options[OPTIONS.FOLDER_PATH],
        github,
    }
    if (code) {
        await writeComponent({
            ...sharedArgs,
            code,
            commitMessagePatterns: {
                create: config.options[OPTIONS.COMMIT_CREATE_PATTERN],
                delete: config.options[OPTIONS.COMMIT_DELETE_PATTERN],
                update: config.options[OPTIONS.COMMIT_UPDATE_PATTERN],
            },
            componentFiles: state[STATE.COMPONENT_FILES] ?? {},
            componentName: state[STATE.COMPONENT_NAME],
            componentNameOld: state[STATE.COMPONENT_NAME_OLD],
            diffType: state[STATE.DIFF_TYPE],
            fileExt: config.options[OPTIONS.FILE_EXT],
            filePath: state[STATE.FILE_PATH],
            logger,
            outputPath: config.options[OPTIONS.OUTPUT_PATH],
        })
        return { code, state }
    } else {
        return findAssets({
            ...sharedArgs,
            globPattern: config.options[OPTIONS.GLOB_PATTERN],
            nameScheme: config.options[OPTIONS.NAME_SCHEME],
            state,
        })
    }
}
