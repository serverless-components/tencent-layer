# 配置文档

## 全部配置

```yml
# serverless.yml

component: layer
name: layerDemo
org: orgDemo
app: appDemo
stage: dev

inputs:
  name: test
  region: ap-guangzhou
  src: ./node_modules
  # src:
  #   src: ./node_modules
  #   exclude:   # 被排除的文件或目录
  #     - .env
  #     - node_modules
  # src:
  #   bucket: layers
  #   object: sls-layer-test-1584524206.zip
  #   exclude:   # 被排除的文件或目录
  #     - .env
  #     - node_modules
  runtimes:
    - Nodejs10.14
  description: test project layer
```

## 配置描述

| 参数名称    | 是否必填 | 参数类型 | 默认值 | 描述                                                           |
| ----------- | :------: | :------: | :----: | -------------------------------------------------------------- |
| region      |    是    |  String  |        | 地区                                                           |
| name        |    是    |  String  |        | 层名称                                                         |
| src         |    是    |  String  |        | 默认为当前目录, 如果是对象, 配置参数参考 [执行目录](#执行目录) |
| runtimes    |    是    | String[] |        | 层支持的运行环境                                               |
| description |    否    |  String  |        | 描述                                                           |

## 执行目录

| 参数名称 | 是否必填 |    参数类型     | 默认值 | 描述                                                                                                                                                                                 |
| -------- | :------: | :-------------: | :----: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| src      |    否    |     String      |        | 代码路径。与 object 不能同时存在。                                                                                                                                                   |
| exclude  |    否    | Array of String |        | 不包含的文件或路径, 遵守 [glob 语法](https://github.com/isaacs/node-glob)                                                                                                            |
| bucket   |    否    |     String      |        | bucket 名称。如果配置了 src，表示部署 src 的代码并压缩成 zip 后上传到 bucket-appid 对应的存储桶中；如果配置了 object，表示获取 bucket-appid 对应存储桶中 object 对应的代码进行部署。 |
| object   |    否    |     String      |        | 部署的代码在存储桶中的路径。                                                                                                                                                         |
