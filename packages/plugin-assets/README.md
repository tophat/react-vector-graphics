# `@react-vector-graphics/plugin-assets`

## Usage

The plugin works in two stages discovery and storage.

```json
{
    "plugins": [
        "@react-vector-graphics/plugin-assets",
        "@svgr/plugin-svgo",
        "@react-vector-graphics/plugin-assets"
    ],
    "options": {
        "assets/globPattern": "./assets/*.svg",
        "assets/fileExt": ".js",
        "assets/nameScheme": "PascalCase",
        "assets/outputPath": "./components"
    }
}
```

`npx rvg`

### Discovery

This should be run before any other plugin that relies on having the svg code in the state.

It uses the `globPattern` supplied to find matching files and loaded them into the process.

Splitting off a new branch for each discovered file adding it to the state.

```json
{
    "componentName": "BarIcon",
    "filePath": "./assets/bar.icon.svg"
}
```

```json
{
    "componentName": "FooIcon",
    "filePath": "./assets/foo.icon.svg"
}
```

### Storage

At the end of all state manipulations, the plugin is the run with the updated state.

Saving each icon in the output folder as well as any `componentFiles` that have been added.

## Options

Fixed options that do not change through run lifecycle

### `assets/globPattern`

Glob string pattern, see [`glob`](https://www.npmjs.com/package/glob)

### `assets/fileExt`

The file extension that is used to write the react component file

### `assets/nameScheme`

String reprenting the naming scheme used to tranform the icon filename to a component name

| Supported schemes |
| ----------------- |
| `camelCase`       |
| `PascalCase`      |
| `CONSTANT_CASE`   |
| `snake_case`      |
| `spinal-case`     |

### `assets/outputPath`

String pointing to final location all react components are stored in.

## State

Mutable context that can be used to pass information between subsequent run stages

### `componentName`

String representing the name of the react component.

*NOTE*: This is shared with `@svgr/plugin-jsx`

### `filePath`

String representing the path to the svg file that was discovered

*NOTE*: This is shared with `@svgr/plugin-jsx`

### `assets/componentFiles`

Map of file names to content that are associated with the generated components.

If this is a non empty map then a component folder is used instead of a single file.

Example having this in the state

```json
{
    "componentName": "FooIcon",
    "filePath": "./assets/foo.icon.svg",
    "assets/componentFiles": {
        "README.md": "# FooIcon"
    }
}
```

Would result in

```sh
./components/FooIcon/index.js # svg component code
./components/FooIcon/README.md
```
