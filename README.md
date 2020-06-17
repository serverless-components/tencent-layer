# 腾讯云 Layer 组件

简体中文 | [English](./README.en.md)

## 简介

腾讯云 Layer 组件。

## 快速开始

1. [安装](#1-安装)
2. [配置](#2-配置)
3. [部署](#3-部署)
4. [移除](#4-移除)
5. [账号配置（可选）](#5-账号配置（可选）)

### 1. 安装

通过 npm 全局安装 [serverless cli](https://github.com/serverless/serverless)

```shell
$ npm install -g serverless
```

### 2. 配置

在项目根目录创建 `serverless.yml` 文件，在其中进行如下配置

```shell
$ touch serverless.yml
```

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

- [更多配置](https://github.com/serverless-components/tencent-layer/tree/master/docs/configure.md)

### 3. 部署

如您的账号未 [登录](https://cloud.tencent.com/login) 或 [注册](https://cloud.tencent.com/register) 腾讯云，您可以直接通过 `微信` 扫描命令行中的二维码进行授权登陆和注册。

通过 `sls` 命令进行部署，并可以添加 `--debug` 参数查看部署过程中的信息

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

> 注意: `sls` 是 `serverless` 命令的简写。

### 4. 移除

通过以下命令移除部署的 API 网关

```bash
$ sls remove --debug

  DEBUG ─ Flushing template state and removing all components.
  DEBUG ─ Start removing layer: test, version: 7...
  DEBUG ─ Remove layer: test, version: 7 successfully

  6s › MyLayer › done
```

### 5. 账号配置（可选）

当前默认支持 CLI 扫描二维码登录，如您希望配置持久的环境变量/秘钥信息，也可以本地创建 `.env` 文件

```bash
$ touch .env # 腾讯云的配置信息
```

在 `.env` 文件中配置腾讯云的 SecretId 和 SecretKey 信息并保存

如果没有腾讯云账号，可以在此 [注册新账号](https://cloud.tencent.com/register)。

如果已有腾讯云账号，可以在 [API 密钥管理](https://console.cloud.tencent.com/cam/capi) 中获取 `SecretId` 和`SecretKey`.

```text
# .env
TENCENT_SECRET_ID=123
TENCENT_SECRET_KEY=123
```

### 更多组件

可以在 [Serverless Components](https://github.com/serverless/components) repo 中查询更多组件的信息。
