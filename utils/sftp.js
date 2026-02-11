import Client from 'ssh2-sftp-client'

/**
 * @typedef {Object} SftpConfig
 * @property {string} host
 * @property {string} username
 * @property {string} privateKey
 */

/**
 * @typedef {Object} SftpResponse
 * @property {string} message
 * @property {string} error
 * @property {boolean} successful
 */

/**
 * Moves a file by its path to a new destination on an SFTP host. Returns an error or success message.
 * @param {string} filePath - The path to the local file to upload
 * @param {string} dest - The path to the destination file on the remote server including the new name
 * @param {SftpConfig} sftpConfig - SFTP authentication details
 * @returns {Promise<SftpResponse>} - { message: string, error: string, successful: boolean }
 */
export async function renameSftpFile(filePath, dest, sftpConfig) {
  if (!sftpConfig.host || !sftpConfig.username || !sftpConfig.privateKey) {
    throw Error('missing SFTP authentication details')
  }

  let successful = false
  const sftp = new Client()
  let msg
  let errMsg
  try {
    await sftp.connect(sftpConfig)
  } catch (error) {
    errMsg = error.message || error
    msg = 'Error connecting to SFTP for moving file.'
    console.error(msg, errMsg)
    return { message: msg, error: errMsg, successful }
  }

  try {
    console.log(`moving file ${filePath}`)
    await sftp.rename(filePath, dest)
    msg = `succesfully moved ${filePath} to ${dest}`
    successful = true
    console.log(msg)
  } catch (error) {
    errMsg = error.message || error
    msg = `Error moving file ${filePath} to ${dest}.`
    console.error(msg, errMsg)
  } finally {
    await sftp.end()
    console.log('done')
  }
  return { message: msg, error: errMsg, successful }
}
