# react-vector-graphics

<span><img align="right" width="200" height="200" src="./assets/logo.svg" alt="Logo"></span>

![Node CI](https://github.com/tophat/react-vector-graphics/workflows/Node%20CI/badge.svg)
[![codecov](https://codecov.io/gh/tophat/react-vector-graphics/branch/master/graph/badge.svg)](https://codecov.io/gh/tophat/react-vector-graphics)

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![Dependabot](https://flat.badgen.net/dependabot/tophat/yvm?icon=dependabot)](https://app.dependabot.com/accounts/tophat/repos/137530684)

[![Slack workspace](https://slackinvite.dev.tophat.com/badge.svg)](https://opensource.tophat.com/slack)<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)<!-- ALL-CONTRIBUTORS-BADGE:END -->

## Overview

Automate the building of `React` components from svg files.

## Motivation

Started off as a project to stop svg files from being scattered over multiple repos. It turned into a way to auto generate the react components directly to reduce boilerplate. Then have the auto generation support multiple configuration per repository. Finally creating a bot to handle the generation and optimisation of the svgs.

## Usage

See individual package readmes for more detailed documentation.

| Documentation                                                                | Version                                                                                                                                                     |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@react-vector-graphics/core`](./packages/core/README.md)                   | [![npm version](https://img.shields.io/npm/v/@react-vector-graphics/core.svg)](https://www.npmjs.com/package/@react-vector-graphics/core)                   |
| [`@react-vector-graphics/cli`](./packages/cli/README.md)                     | [![npm version](https://img.shields.io/npm/v/@react-vector-graphics/cli.svg)](https://www.npmjs.com/package/@react-vector-graphics/cli)                     |
| [`@react-vector-graphics/plugin-assets`](./packages/plugin-assets/README.md) | [![npm version](https://img.shields.io/npm/v/@react-vector-graphics/plugin-assets.svg)](https://www.npmjs.com/package/@react-vector-graphics/plugin-assets) |
| [`@react-vector-graphics/plugin-github`](./packages/plugin-github/README.md) | [![npm version](https://img.shields.io/npm/v/@react-vector-graphics/plugin-github.svg)](https://www.npmjs.com/package/@react-vector-graphics/plugin-github) |

## Contributing

Install dependencies

```sh
yarn install
```

Run all tests

```sh
yarn test:watch
```

Build all packages

```sh
yarn build:watch
```

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://emmanuel.ogbizi.com"><img src="https://avatars0.githubusercontent.com/u/2528959?v=4" width="100px;" alt=""/><br /><sub><b>Emmanuel Ogbizi</b></sub></a><br /><a href="https://github.com/tophat/react-vector-graphics/commits?author=iamogbz" title="Code">💻</a> <a href="#ideas-iamogbz" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-iamogbz" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-iamogbz" title="Maintenance">🚧</a> <a href="https://github.com/tophat/react-vector-graphics/commits?author=iamogbz" title="Tests">⚠️</a> <a href="#design-iamogbz" title="Design">🎨</a> <a href="https://github.com/tophat/react-vector-graphics/commits?author=iamogbz" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/umar-ahmed"><img src="https://avatars1.githubusercontent.com/u/8302959?v=4" width="100px;" alt=""/><br /><sub><b>Umar Ahmed</b></sub></a><br /><a href="https://github.com/tophat/react-vector-graphics/commits?author=umar-ahmed" title="Code">💻</a> <a href="#ideas-umar-ahmed" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

```txt
@all-contributors please add <username> for <contribution type>
```
