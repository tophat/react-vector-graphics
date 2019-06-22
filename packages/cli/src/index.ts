import yargs from 'yargs'
import * as path from 'path'
import * as fs from 'fs-extra'

import convert from '@iconic/core'

function run(src: string, dest: string): void {
    const files = fs.readdirSync(src)
    const filesContents = files.map((file): [string, string] => [
        file,
        fs.readFileSync(path.join(src, file), { encoding: 'utf-8' }),
    ])
    const results = filesContents.map(([file, contents]): object =>
        convert(file, contents),
    )
    for (const result of results) {
        for (const [file, contents] of Object.entries(result)) {
            const filePath = path.join(dest, file)
            fs.outputFileSync(filePath, contents)
        }
    }
}

if (!yargs.argv.src || !yargs.argv.dest) {
    console.error('Missing src and dest') /* eslint-disable-line no-console */
} else {
    const args = yargs.argv
    const src = args.src as string
    const dest = args.dest as string
    run(src, dest)
}
