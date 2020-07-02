const { generateId, getServerlessSdk } = require('./utils')

// set enough timeout for deployment to finish
jest.setTimeout(600000)

// the yaml file we're testing against
const instanceYaml = {
  org: 'orgDemo',
  app: 'appDemo',
  component: 'layer',
  name: `layer-integration-tests-${generateId()}`,
  stage: 'dev',
  inputs: {
    region: 'ap-guangzhou',
    src: './example/layer-folder',
    runtimes: ['Nodejs10.15']
  }
}

// get credentials from process.env but need to init empty credentials object
const credentials = {
  tencent: {}
}

// get serverless construct sdk
const sdk = getServerlessSdk(instanceYaml.org)

it('should successfully deploy layer service', async () => {
  const instance = await sdk.deploy(instanceYaml, { tencent: {} })

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
