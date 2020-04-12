# react-vector-graphics

<span><img align="right" width="200" height="200" src="./assets/logo.svg" alt="Logo"></span>

![Node CI](https://github.com/tophat/react-vector-graphics/workflows/Node%20CI/badge.svg)
[![codecov](https://codecov.io/gh/tophat/react-vector-graphics/branch/master/graph/badge.svg)](https://codecov.io/gh/tophat/react-vector-graphics)

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Dependabot](https://flat.badgen.net/dependabot/tophat/yvm?icon=dependabot)](https://app.dependabot.com/accounts/tophat/repos/137530684)

[![Slack workspace](https://slackinvite.dev.tophat.com/badge.svg)](https://opensource.tophat.com/slack)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

## Overview

Automate the building of `React` components from svg files.

## Motivation

Started off as a project to stop svg files from being scattered over multiple repos. It turned into a way to auto generate the react components directly to reduce boilerplate. Then have the auto generation support multiple configuration per repository. Finally creating a bot to handle the generation and optimisation of the svgs.

## Usage

See individual package readmes for more detailed documentation.

### [`@react-vector-graphics/core`](./packages/core/README.md)

### [`@react-vector-graphics/cli`](./packages/cli/README.md)

### [`@react-vector-graphics/plugin-assets`](./packages/plugin-assets/README.md)

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

_You don't really have to add this section yourself! Simply use [all-contributors](https://allcontributors.org/) by adding comments in your PRs like so:_
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://emmanuel.ogbizi.com"><img src="https://avatars0.githubusercontent.com/u/2528959?v=4" width="100px;" alt=""/><br /><sub><b>Emmanuel Ogbizi</b></sub></a><br /><a href="https://github.com/tophat/react-vector-graphics/commits?author=iamogbz" title="Code">💻</a> <a href="#ideas-iamogbz" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-iamogbz" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-iamogbz" title="Maintenance">🚧</a> <a href="https://github.com/tophat/react-vector-graphics/commits?author=iamogbz" title="Tests">⚠️</a> <a href="#design-iamogbz" title="Design">🎨</a> <a href="https://github.com/tophat/react-vector-graphics/commits?author=iamogbz" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

```txt
@all-contributors please add <username> for <contribution type>
```

_Find out more about All-Contributors on their website!_
