const path = require('path')
require('dotenv').config({
  path: path.join(__dirname, '..', '.env.test')
})
const { generateId, getServerlessSdk } = require('./lib/utils')

const instanceYaml = {
  org: 'orgDemo',
  app: 'appDemo',
  component: 'layer@dev',
  name: `layer-integration-tests-${generateId()}`,
  stage: 'dev',
  inputs: {
    region: 'ap-guangzhou',
    src: path.join(__dirname, '..', 'example/layer-folder'),
    runtimes: ['Nodejs10.15']
  }
}

const credentials = {
  tencent: {
    SecretId: process.env.TENCENT_SECRET_ID,
    SecretKey: process.env.TENCENT_SECRET_KEY,
  }
}

const sdk = getServerlessSdk(instanceYaml.org)

it('should successfully deploy layer service', async () => {
  const instance = await sdk.deploy(instanceYaml, credentials)

  expect(instance).toBeDefined()
  expect(instance.instanceName).toEqual(instanceYaml.name)
  expect(instance.outputs).toBeDefined()
  expect(instance.outputs.region).toEqual(instanceYaml.inputs.region)
  expect(instance.outputs.runtimes).toBeDefined()
  expect(instance.outputs.runtimes.length).toEqual(1)
  expect(instance.outputs.runtimes[0]).toEqual(instanceYaml.inputs.runtimes[0])
})

it('should successfully remove layer service', async () => {
  await sdk.remove(instanceYaml, credentials)
  result = await sdk.getInstance(
    instanceYaml.org,
    instanceYaml.stage,
    instanceYaml.app,
    instanceYaml.name
  )

  expect(result.instance.instanceStatus).toEqual('inactive')
})
