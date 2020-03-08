import * as fs from 'fs'

import * as glob from 'glob'

type Config = { globPattern: string; outputPath: string }
type Asset = { svg: string; state: State }

export default async function({
    globPattern = '*.svg',
    outputPath = './components',
}: Config): Promise<Asset[]> {
    return glob.sync(globPattern).map(
        (filePath: string): Asset => ({
            state: { filePath, outputPath },
            svg: fs.readFileSync(filePath, { encoding: 'utf-8' }),
        }),
    )
}
