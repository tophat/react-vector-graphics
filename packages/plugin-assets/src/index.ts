import * as fs from 'fs'

import * as glob from 'glob'

import { Asset, FindPluginConfiguration } from '@react-vector-graphics/types'

export default async function pluginAssets({
    globPattern = '*.svg',
    outputPath = './components',
}: FindPluginConfiguration): Promise<Asset[]> {
    return glob.sync(globPattern).map(
        (filePath: string): Asset => ({
            state: { filePath, outputPath },
            svg: fs.readFileSync(filePath, { encoding: 'utf-8' }),
        }),
    )
}
