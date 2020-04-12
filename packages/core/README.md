# `@react-vector-graphics/core`

This config files for this package should be backwards compatible with `@svgr/svgr`

## Usage

```js
const rgvCore = require('@react-vector-graphics/core').default
const myPlugin = require('./myPlugin')

const config = {
  plugins: [
    '@react-vector-graphics/plugin-assets',
    myPlugin,
    '@svgr/plugin-svgo',
  ],
  options: {
    "assets/globPattern": "./assets/*.svg",
  },
  svgoConfig: {
    multipass: true,
  }
}

rvgCore({ config, logger: console })
```

### Configuration

This is an super set of the [`svgr` configuration](https://react-svgr.com/docs/configuration-files/).

See `@react-vector-graphics/types` for definitions.

#### `plugins`

The plugins that will be run in order. These can be module names as strings which will then imported to get the underlying function or functions that will be called directly with the options and other parameters

#### `options`

The options that the plugins will be initiated with. It is a good idea to namespace the path in the `config.options` to prevent collisions between independent plugins.

```json
{
  "plugins": [
    "myPlugin",
    "other-plugin"
  ],
  "options": {
    "myPlugin/shrink": false,
    "otherPlugin/shrink": true
  }
}
```

### Plugins

Plugins are functions that will be called with the following parameters in order.

#### `code`

A string representing the svg file that has been read and modified so far

#### `config`

The initial configuration object, see [config](#configuration).

#### `state`

The current state of execution, can be modified by plugins to pass information to other plugins further down in the execution chain. The namespacing recommendation as the [`options`](#options) applies.

#### `logger`

This is an optional argument that allows the plugin to log output with custom levels.

*NOTE*: this is not guaranteed to exist and defaults to `console`.
