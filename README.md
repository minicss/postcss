# postcss

MiniCSS PostCSS Plugin

[![Test](https://github.com/minicss/postcss/actions/workflows/test.yml/badge.svg)](https://github.com/minicss/postcss/actions/workflows/test.yml)
[![Coverage](https://codecov.io/gh/minicss/postcss/branch/main/graph/badge.svg?token=66XL2V4MY9)](https://codecov.io/gh/minicss/postcss)
[![License](https://img.shields.io/github/license/minicss/postcss.svg)](https://github.com/minicss/postcss/blob/main/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@minicss/postcss.svg)](https://www.npmjs.com/package/@minicss/postcss)
[![NPM Monthly Downloads](https://img.shields.io/npm/dm/@minicss/postcss.svg)](https://www.npmjs.com/package/@minicss/postcss)
[![NPM Total Downloads](https://img.shields.io/npm/dt/@minicss/postcss.svg)](https://www.npmjs.com/package/@minicss/postcss)
[![Built with TypeScript](https://img.shields.io/npm/types/prototyped.js.svg)](https://www.typescriptlang.org)
[![Tested With Jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://jestjs.io)
[![Open GitHub Issues](https://img.shields.io/github/issues-raw/minicss/postcss.svg)](https://github.com/minicss/postcss/issues)
[![Open GitHub Pull Requests](https://img.shields.io/github/issues-pr-raw/minicss/postcss)](https://github.com/minicss/postcss/pulls)
[![Github Stars](https://img.shields.io/github/stars/minicss/postcss.svg?style=social&label=Stars)](https://github.com/minicss/postcss)
[![Github Forks](https://img.shields.io/github/forks/minicss/postcss.svg?style=social&label=Fork)](https://github.com/minicss/postcss)

## Table of Content

- [Installation](#installation)
- [Usage](#usage)
  - [Options](#options)
- [Benchmarks](#benchmarks)
- [Versioning](#versioning)
- [Authors](#authors)
- [License](#license)

## Installation

```shell
npm i @minicss/postcss
```

## Usage

Create the `postcss.config.js` file:

```javascript
module.exports = {
  plugins: {
    "@minicss/postcss": {},
  },
};
```

### Options

|     Name      |  Type   | Default |                         Description                         |
|:-------------:|:-------:|:-------:|:-----------------------------------------------------------:|
|    classes    | boolean | `true`  |            Should the plugin rename css classes             |
|      ids      | boolean | `true`  |              Should the plugin rename css ids               |
|   variables   | boolean | `true`  |           Should the plugin rename css variables            |
| outputMapFile | string  |    -    | Where to write the output map to be used outside the plugin |

> `*` means the options is required.

## Benchmarks

First build the project:

```shell
npm run build
```

Then run the command below:

```shell
npm run benchmark
```

## Versioning

We use [SemVer](http://semver.org) for versioning.
For the versions available, see the [releases on this repository](https://github.com/minicss/postcss/releases).

## Authors

- **Ardalan Amini** - _Core Maintainer_ - [@ardalanamini](https://github.com/ardalanamini)

See also the list of [contributors](https://github.com/minicss/postcss/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/minicss/postcss/blob/main/LICENSE) file for details.
