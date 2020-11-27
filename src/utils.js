const { Cos } = require('tencent-component-toolkit')
const { TypeError } = require('tencent-component-toolkit/src/utils/error')
const ensureIterable = require('type/iterable/ensure')
const ensureString = require('type/string/ensure')
const CONFIGS = require('./config')

/*
 * Pauses execution for the provided miliseconds
 *
 * @param ${number} wait - number of miliseconds to wait
 */
const sleep = async (wait) => new Promise((resolve) => setTimeout(() => resolve(), wait))

/*
 * Generates a random id
 */
const generateId = () =>
  Math.random()
    .toString(36)
    .substring(6)

/**
 * Upload code to COS
 * @param {Component} instance serverless component instance
 * @param {string} appId app id
 * @param {object} credentials credentials
 * @param {object} inputs component inputs parameters
 * @param {string} region region
 */
const uploadCodeToCos = async (instance, appId, credentials, inputs, region) => {
  const bucketName = inputs.code.bucket || `sls-layer-${region}-code`
  const objectName = inputs.code.object || `${inputs.name}-${Math.floor(Date.now() / 1000)}.zip`
  // if set bucket and object not pack code
  if (!inputs.code.bucket || !inputs.code.object) {
    const zipPath = inputs.code.src
    if (!zipPath) {
      throw new TypeError('PARAMETER_LAYER_UPLOADCODETOCOS', 'Parameter inputs.src is required.')
    }
    console.log(`Code zip path ${zipPath}`)

    // save the zip path to state for lambda to use it
    instance.state.zipPath = zipPath

    const cos = new Cos(credentials, region)

    if (!inputs.code.bucket) {
      // create default bucket
      await cos.deploy({
        bucket: bucketName + '-' + appId,
        force: true,
        lifecycle: [
          {
            status: 'Enabled',
            id: 'deleteObject',
            filter: '',
            expiration: { days: '10' },
            abortIncompleteMultipartUpload: { daysAfterInitiation: '10' }
          }
        ]
      })
    }

    // upload code to cos
    if (!inputs.code.object) {
      console.log(`Getting cos upload url for bucket ${bucketName}`)
      const uploadUrl = await cos.getObjectUrl({
        bucket: bucketName + '-' + appId,
        object: objectName,
        method: 'PUT'
      })
      console.log(`Uploading code to bucket ${bucketName}`)
      try {
        await instance.uploadSourceZipToCOS(zipPath, uploadUrl)
      } catch (e) {
        console.log(e)
        throw new TypeError('ENGINE_LAYER_UPLOAD_CODE', e.message, e.stack)
      }
      console.log(`Upload ${objectName} to bucket ${bucketName} success`)
    }
  }

  // save bucket state
  instance.state.bucket = bucketName
  instance.state.object = objectName

  return {
    bucket: bucketName,
    object: objectName
  }
}

const capitalString = (str) => {
  if (str.length < 2) {
    return str.toUpperCase()
  }

  return `${str[0].toUpperCase()}${str.slice(1)}`
}

const prepareInputs = async (instance, credentials, appId, inputs = {}) => {
  const layerInputs = {
    code: {
      src: inputs.src,
      bucket: inputs.srcOriginal && inputs.srcOriginal.bucket,
      object: inputs.srcOriginal && inputs.srcOriginal.object
    },
    region: inputs.region || CONFIGS.region,
    name:
      ensureString(inputs.name, { isOptional: true }) ||
      instance.state.name ||
      `${CONFIGS.compName}_component_${generateId()}`,
    runtimes: ensureIterable(inputs.runtimes, {
      default: CONFIGS.runtimes
    }),
    description: ensureString(inputs.description, {
      default: CONFIGS.description
    })
  }

  const { bucket, object } = await uploadCodeToCos(
    instance,
    appId,
    credentials,
    layerInputs,
    layerInputs.region
  )
  layerInputs.bucket = bucket
  layerInputs.object = object
  return layerInputs
}

module.exports = {
  generateId,
  sleep,
  uploadCodeToCos,
  capitalString,
  prepareInputs
}
