import { OPTIONS, STATE } from './constants'
import findAssets from './findAssets'
import writeComponent from './writeComponent'
import type { PluginGitHubOptions } from './types'
import type { NamingScheme, Plugin, State } from '@react-vector-graphics/types'

export const run: Plugin = async (code, config, state, logger) => {
    const options: Partial<PluginGitHubOptions> = config.options ?? {}

    const github = {
        api: options?.[OPTIONS.API],
        base: options?.[OPTIONS.BASE],
        head: options?.[OPTIONS.HEAD],
        owner: options?.[OPTIONS.OWNER],
        repo: options?.[OPTIONS.REPO],
    }
    const sharedArgs = {
        folderPath: options?.[OPTIONS.FOLDER_PATH],
        github,
    }
    if (code) {
        const opts = {
            ...sharedArgs,
            assetFile: state[STATE.FILE_PATH as keyof State],
            code,
            commitMessagePatterns: {
                create: options?.[OPTIONS.COMMIT_CREATE_PATTERN],
                delete: options?.[OPTIONS.COMMIT_DELETE_PATTERN],
                update: options?.[OPTIONS.COMMIT_UPDATE_PATTERN],
            },
            componentFiles: state[STATE.COMPONENT_FILES as keyof State] ?? {},
            componentName: state[STATE.COMPONENT_NAME as keyof State],
            componentNameOld: state[STATE.COMPONENT_NAME_OLD as keyof State],
            diffType: state[STATE.DIFF_TYPE as keyof State],
            fileExt: options?.[OPTIONS.FILE_EXT],
            logger,
            outputPath: options?.[OPTIONS.OUTPUT_PATH],
        }
        // @ts-expect-error TODO
        await writeComponent(opts)
        return { code, state: state as State }
    } else {
        return findAssets({
            ...sharedArgs,
            // @ts-expect-error Args need to be pre-validated
            globPattern: options?.[OPTIONS.GLOB_PATTERN],
            nameScheme: options?.[OPTIONS.NAME_SCHEME] as NamingScheme,
            state,
        })
    }
}
