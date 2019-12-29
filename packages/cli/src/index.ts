import * as path from 'path'

import yargs from 'yargs'
import * as fs from 'fs-extra'
import convert from '@react-vector-graphics/core'

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

const argv = yargs
    .usage('Usage: $0 -s [src] -d [dest]')
    .option('src', {
        alias: 's',
        describe: 'source folder',
        type: 'string',
    })
    .option('dest', {
        alias: 'd',
        describe: 'destination folder',
        type: 'string',
    })
    .demandOption(['s', 'd']).argv

const src = argv.s as string
const dest = argv.d as string
run(src, dest)
