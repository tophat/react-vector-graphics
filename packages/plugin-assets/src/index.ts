import * as fs from 'fs-extra'

export default function({ path }: { path: string }) {
    const files = fs.readdirSync(src)
    const filesContents = files.map((file): [string, string] => [
        file,
        fs.readFileSync(path.join(src, file), { encoding: 'utf-8' }),
    ])
}
