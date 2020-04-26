# `@react-vector-graphics/plugin-github`

## Usage

The plugin works in two stages discovery and storage.

```json
{
    "plugins": [
        "@react-vector-graphics/plugin-github",
        "@svgr/plugin-svgo",
        "@react-vector-graphics/plugin-github"
    ],
    "options": {
        "github/globPattern": "assets/*.svg",
        "github/fileExt": "js",
        "github/folderPath": "src",
        "github/head": "current-branch-or-commit",
        "github/nameScheme": "PascalCase",
        "github/outputPath": "components"
    }
}
```

### Discovery

This should be run before any other plugin that relies on having the svg code in the state.

It uses the `globPattern` supplied to find matching files and loaded them into the process.

Splitting off a new branch for each discovered file adding it to the state.

```json
{
    "componentName": "BarIcon",
    "filePath": "assets/bar.icon.svg"
}
```

```json
{
    "componentName": "FooIcon",
    "filePath": "assets/foo.icon.svg"
}
```

### Storage

At the end of all state manipulations, the plugin is the run with the updated state.

Saving each icon in the output folder as well as any `componentFiles` that have been added.

## Options

Fixed options that do not change through run lifecycle. Any option without a default is **Required**.

### `assets/api`

Octokit powered github rest api, see [octokit `rest.js`](https://www.npmjs.com/package/@octokit/rest)

This will need push access to the repository to commit the file changes.

### `assets/base`

Base to compare changes in `head` against.

**Default**: `master`

### `assets/commitCreate`

Pattern used when commit a newly added svg react component.

**Default**: `feat: ${message}`

The `${message}` portion is replaced with `'add ComponentName fileName.fileExt'` before committing.

### `assets/commitDelete`

Pattern used when deleting a remove svg component.

**Default**: `refactor: ${message}\nBREAKING CHANGE: ${message}`

The `${message}` portion is replaced with `'removed ComponentName'` before committing.

### `assets/commitUpdate`

Pattern used when updating an svg react component.

**Default**: `fix: ${message}`

The `${message}` portion is replaced with `'modify ComponentName fileName.fileExt'` before committing.

### `assets/fileExt`

The file extension that is used to write the react component file

**Default**: `''`

### `assets/folderPath`

The base folder for all actions in the repository.

**Default**: `''`

### `assets/globPattern`

Glob string pattern, see [`minimatch`](https://www.npmjs.com/package/minimatch)

### `assets/head`

The current commit or branch ref that has the svg changes.

### `assets/nameScheme`

String reprenting the naming scheme used to tranform the icon filename to a component name

| Supported schemes |
| ----------------- |
| `camelCase`       |
| `PascalCase`      |
| `CONSTANT_CASE`   |
| `snake_case`      |
| `spinal-case`     |

**Default**: `PascalCase`

### `assets/outputPath`

String pointing to final location all react components are stored in.

### `assets/owner`

The repository owner e.g. `tophat`.

### `assets/repo`

The repository name e.g. `react-vector-graphics`.

## State

Mutable context that can be used to pass information between subsequent run stages

### `componentName`

String representing the name of the react component.

_NOTE_: This is shared with `@svgr/plugin-jsx`

### `filePath`

String representing the path to the svg file that was discovered

_NOTE_: This is shared with `@svgr/plugin-jsx`

### `assets/componentFiles`

Map of file names to content that are associated with the generated components.

If this is a non empty map then a component folder is used instead of a single file.

Example having this in the state

```json
{
    "componentName": "FooIcon",
    "filePath": "assets/foo.icon.svg",
    "github/componentFiles": {
        "README.md": "# FooIcon"
    }
}
```

Would result in

```sh
src/components/FooIcon/index.js # svg component code
src/components/FooIcon/README.md
```

### `assets/componentNameOld`

This is only set when an svg file has been marked as moved/renamed by github.

This will result in the a new component being added at `componentName` and the `componentNameOld` being deleted.

### `assets/diffType`

This status indicates the type of change for the svg file discovered.

| Statuses   |
| ---------- |
| `added`    |
| `modified` |
| `removed`  |
| `renamed`  |
