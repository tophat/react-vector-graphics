import pathToName from '../src/pathToName'

describe('pathToName', () => {
    it.each`
        nameScheme
        ${`CONSTANT_CASE`}
        ${`camelCase`}
        ${`PascalCase`}
        ${`snake_case`}
        ${`spinal-case`}
    `(
        'converts file path to correct naming scheme $nameScheme',
        ({ nameScheme }) => {
            expect(
                pathToName(
                    'example/assets/file3_white.24x24.icon.svg',
                    nameScheme,
                ),
            ).toMatchSnapshot()
        },
    )
})
