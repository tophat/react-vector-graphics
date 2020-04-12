# `@react-vector-graphics/cli`

## Usage

`npx rvg --config=my.rvgrc`

Where config file can be any of the formats supported by `cosmiconfig` with the contents matching the specs of the [`@react-vector-graphics/core`](../core/README.md#configuration) package.

If no config variable is supplied `rvg` will attempt to traverse the current search space using `cosmiconfig` to find a suitable config, but will fail if none is found.
