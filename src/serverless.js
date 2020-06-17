const { Component } = require('@serverless/core')
const { Layer } = require('tencent-component-toolkit')
const { TypeError } = require('tencent-component-toolkit/src/utils/error')
const { prepareInputs } = require('./utils')
const CONFIGS = require('./config')

class ServerlessComponent extends Component {
  getCredentials() {
    const { tmpSecrets } = this.credentials.tencent

    if (!tmpSecrets || !tmpSecrets.TmpSecretId) {
      throw new Error(
        'Cannot get secretId/Key, your account could be sub-account or does not have access, please check if SLS_QcsRole role exists in your account, and visit https://console.cloud.tencent.com/cam to bind this role to your account.'
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
      throw new TypeError('PARAMETER_LAYER', e.message, e.stack)
    }

    inputs.oldState = this.state
    const deployRes = await layer.deploy(layerInputs)
    this.state = deployRes

    const outputs = deployRes

    return outputs
  }

  async remove() {
    const { layerName } = this.state
    if (!layerName) {
      console.log(`${CONFIGS.compFullname} ${layerName} not exist`)
      return {}
    }
    console.log(`Removing ${CONFIGS.compFullname} ${layerName}...`)

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
