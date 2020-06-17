# Tencent Cloud Layer Component

[简体中文](./README.md) | English

## Introduction

Tencent Cloud Layer serverless component.

## Content

1. [Install](#1-install)
2. [Create](#2-create)
3. [Configure](#3-configure)
4. [Deploy](#4-deploy)
5. [Remove](#5-Remove)

### 1. Install

Install the Serverless Framework globally:

```bash
$ npm install -g serverless
```

### 2. Create

In project root, create the following simple boilerplate:

```bash
$ touch serverless.yml
$ touch .env           # your Tencent api keys
```

Add the access keys of a [Tencent CAM Role](https://console.cloud.tencent.com/cam/capi) with `AdministratorAccess` in the `.env` file, using this format:

```
# .env
TENCENT_SECRET_ID=XXX
TENCENT_SECRET_KEY=XXX
```

- If you don't have a Tencent Cloud account, you could [sign up](https://intl.cloud.tencent.com/register) first.

### 3. Configure

```yml
# serverless.yml
MyLayer:
  component: '@serverless/tencent-layer'
  inputs:
    region: ap-guangzhou
    name: test
    src: ./node_modules
    runtimes:
      - Nodejs8.9
    description: test project layer
```

- [More Options](https://github.com/serverless-components/tencent-layer/blob/master/docs/configure.md)

### 4. Deploy

```bash
$ sls --debug

  DEBUG ─ Resolving the template's static variables.
  DEBUG ─ Collecting components from the template.
  DEBUG ─ Downloading any NPM components found in the template.
  DEBUG ─ Analyzing the template's components dependencies.
  DEBUG ─ Creating the template's components graph.
  DEBUG ─ Syncing template state.
  DEBUG ─ Executing the template's components graph.
  DEBUG ─ Compressing layer test file to /Users/yugasun/Desktop/Develop/serverless/tencent-layer/example/.serverless/test-layer.zip.
  DEBUG ─ Compressed layer test file successful
  DEBUG ─ Uploading layer package to cos[sls-cloudlayer-ap-guangzhou-layer]. sls-cloudlayer-test-1583823859.zip
  DEBUG ─ Creating layer test
  DEBUG ─ Created layer: test, version: 7 successful

  MyLayer:
    region:      ap-guangzhou
    name:        test
    description: test project layer
    runtimes:
      - Nodejs8.9
    licenseInfo:
    hash:        d41cdf04bd33315be0d87e8562de9dd8
    version:     7

  12s › MyLayer › done
```

> Notice: `sls` is short for `serverless` command.

&nbsp;

### 5. Remove

```bash
$ sls remove --debug

  DEBUG ─ Flushing template state and removing all components.
  DEBUG ─ Start removing layer: test, version: 7...
  DEBUG ─ Remove layer: test, version: 7 successfully

  6s › MyLayer › done
```

### More Components

Checkout the [Serverless Components](https://github.com/serverless/components) repo for more information.
