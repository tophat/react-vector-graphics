import { NAMING_SCHEME } from '@react-vector-graphics/utils'

import { OPTIONS, STATE, STATUSES } from '../src'

export const mockGithubApi = {}

export const mockOptions = {
    [OPTIONS.API]: mockGithubApi,
    [OPTIONS.BASE]: 'master',
    [OPTIONS.FILE_EXT]: '.js',
    [OPTIONS.FOLDER_PATH]: 'packages/mock-package',
    [OPTIONS.GLOB_PATTERN]: './assets/*.svg',
    [OPTIONS.HEAD]: 'test-branch',
    [OPTIONS.NAME_SCHEME]: NAMING_SCHEME.CAMEL,
    [OPTIONS.OUTPUT_PATH]: './components',
    [OPTIONS.OWNER]: 'mockOwner',
    [OPTIONS.REPO]: 'mockRepo',
}

export const mockSVG = '<svg>mock</svg>'

export const mockState = {
    [STATE.COMPONENT_FILES]: {
        'README.md': '## mockIcon\n\nmock usage notes',
    },
    [STATE.COMPONENT_NAME]: 'mockIcon',
    [STATE.DIFF_TYPE]: STATUSES.ADDED,
    [STATE.FILE_PATH]: 'assets/mock.icon.svg',
}

export const mockComponent = `
import React from 'react'
export default function mockIcon() {
    return <svg>mock updated</svg>
}
`
