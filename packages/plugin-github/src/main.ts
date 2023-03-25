import { OPTIONS, STATE } from './constants'
import findAssets from './findAssets'
import writeComponent from './writeComponent'

import type { NamingScheme, Plugin, State } from '@react-vector-graphics/types'

export const run: Plugin = async (code, config, state, logger) => {
    const github = {
        api: config.options?.[OPTIONS.API],
        base: config.options?.[OPTIONS.BASE],
        head: config.options?.[OPTIONS.HEAD],
        owner: config.options?.[OPTIONS.OWNER],
        repo: config.options?.[OPTIONS.REPO],
    }
    const sharedArgs = {
        folderPath: config.options?.[OPTIONS.FOLDER_PATH],
        github,
    }
    if (code) {
        const opts = {
            ...sharedArgs,
            assetFile: state[STATE.FILE_PATH as keyof State],
            code,
            commitMessagePatterns: {
                create: config.options?.[OPTIONS.COMMIT_CREATE_PATTERN],
                delete: config.options?.[OPTIONS.COMMIT_DELETE_PATTERN],
                update: config.options?.[OPTIONS.COMMIT_UPDATE_PATTERN],
            },
            componentFiles: state[STATE.COMPONENT_FILES as keyof State] ?? {},
            componentName: state[STATE.COMPONENT_NAME as keyof State],
            componentNameOld: state[STATE.COMPONENT_NAME_OLD as keyof State],
            diffType: state[STATE.DIFF_TYPE as keyof State],
            fileExt: config.options?.[OPTIONS.FILE_EXT],
            logger,
            outputPath: config.options?.[OPTIONS.OUTPUT_PATH],
        }
        // @ts-expect-error TODO
        await writeComponent(opts)
        return { code, state: state as State }
    } else {
        return findAssets({
            ...sharedArgs,
            // @ts-expect-error Args need to be pre-validated
            globPattern: config.options?.[OPTIONS.GLOB_PATTERN],
            nameScheme: config.options?.[OPTIONS.NAME_SCHEME] as NamingScheme,
            state,
        })
    }
}
