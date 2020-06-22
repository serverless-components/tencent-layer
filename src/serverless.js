const { Component } = require('@serverless/core')
const { Layer } = require('tencent-component-toolkit')
const { TypeError } = require('tencent-component-toolkit/src/utils/error')
const { prepareInputs } = require('./utils')
const CONFIGS = require('./config')

class ServerlessComponent extends Component {
  getCredentials() {
    const { tmpSecrets } = this.credentials.tencent

    if (!tmpSecrets || !tmpSecrets.TmpSecretId) {
      throw new TypeError(
        'CREDENTIAL',
        'Cannot get secretId/Key, your account could be sub-account and does not have the access to use SLS_QcsRole, please make sure the role exists first, then visit https://cloud.tencent.com/document/product/1154/43006, follow the instructions to bind the role to your account.'
      )
    }

    return {
      SecretId: tmpSecrets.TmpSecretId,
      SecretKey: tmpSecrets.TmpSecretKey,
      Token: tmpSecrets.Token
    }
  }

  getAppId() {
    return this.credentials.tencent.tmpSecrets.appId
  }

  async deploy(inputs) {
    console.log(`Deploying ${CONFIGS.compFullname}...`)

    // get tencent cloud credentials
    const credentials = this.getCredentials()
    const appId = this.getAppId()

    const layer = new Layer(credentials, inputs.region)
    let layerInputs
    try {
      layerInputs = await prepareInputs(this, credentials, appId, inputs)
    } catch (e) {
      throw new TypeError('PARAMETER_LAYER_DEPLOY', e.message, e.stack)
    }

    inputs.oldState = this.state
    const deployRes = await layer.deploy(layerInputs)
    this.state = deployRes

    const outputs = deployRes

    return outputs
  }

  async remove() {
    const { name } = this.state
    if (!name) {
      console.log(`${CONFIGS.compFullname} ${name} not exist`)
      return {}
    }
    console.log(`Removing ${CONFIGS.compFullname} ${name}...`)

    // get tencent cloud credentials
    const credentials = this.getCredentials()

    const { state } = this

    const layer = new Layer(credentials, state.region)
    await layer.remove(state)
    this.state = {}
    return {}
  }
}

module.exports = ServerlessComponent
