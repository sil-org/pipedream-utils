import { NetsuiteApiClient } from 'netsuite-api-client'
import Client from 'ssh2-sftp-client'

/**
 * Represents the NetSuite OAuth configuration.
 * @typedef {import('netsuite-api-client').NetsuiteOptions} Config
 */

/**
 * Options for a NetSuite request. See https://github.com/julbrs/netsuite-api-client/blob/main/src/types.ts
 * @typedef {import('netsuite-api-client').NetsuiteRequestOptions} Options - Request options
 */

const methods = {
  /**
   * Gets the portion of the URL starting with '/record'. Used to obtain a GET query path from the "location" response
   * header on a NetSuite POST request.
   * @param {string | string[]} url
   * @returns {string}
   */
  getRecordPath(url) {
    const u = Array.isArray(url) ? url[0] : url
    const startIndex = u.indexOf('/record')
    if (startIndex === -1) {
      return u
    }
    return u.substring(startIndex)
  },
  /**
   * Returns a Date object with the end_of_month.beginning_of_day from a Date Time
   * @param {Date | string} date
   * @return {Date}
   */
  lastDay(date) {
    if (!(date instanceof Date && !isNaN(date.getTime()))) {
      return new Date()
    }

    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0, 0, 0, 0, 0))
  },

  /**
   * Normalize strings
   * @param {string | undefined} v
   * @returns {string}
   */
  normalizeString(v) {
    return typeof v === 'string' ? v.trim() : ''
  },
  /**
   * Send a request to NetSuite
   * @param {Options} options - Request options
   * @param {Config} config - NetSuite configuration
   * @returns {Promise<import('netsuite-api-client').NetsuiteResponse>}
   */
  async netsuiteRequest(options, config) {
    const client = new NetsuiteApiClient(config)

    try {
      const response = await client.request(options)
      // After a POST request to a '/record' path, make a GET call to retrieve the new record.
      if (options.method === 'POST' && options?.path?.startsWith('/record') && response.headers['location']) {
        options.method = 'GET'
        options.path = methods.getRecordPath(response.headers['location'])
        delete options.body
        console.log(`requesting new record from NetSuite at: ${options.path}`)
        return await client.request(options)
      }
      return response
    } catch (error) {
      const msg = error instanceof Error ? error.message : error
      console.error('NetSuite API Error:', msg)
      throw new Error(`Failed to execute NetSuite request: ${msg}`)
    }
  },
  /**
   * Query Netsuite.
   * @param {string} query
   * @param {Config} config - NetSuite configuration
   * @returns {Promise<any>}
   */
  async netsuiteQueryRecords(query, config) {
    const client = new NetsuiteApiClient(config)
    const limit = 1
    let offset = 0
    /** @type {import('netsuite-api-client').NetsuiteQueryResult} */
    let response

    try {
      response = await client.query(query, limit, offset)
    } catch (error) {
      const msg = error instanceof Error ? error.message : error
      console.error('NetSuite SuiteQL error', msg)
      throw new Error(`Failed to execute SuiteQL query: ${msg}`)
    }

    if (response?.items.length === 0) {
      throw new Error(`no record found for query: ${query}`)
    }

    if (response?.items.length !== 1) {
      throw new Error(`more than one record found for query: ${query}`)
    }

    return response.items[0]
  },

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
  async renameFile(filePath, dest, sftpConfig) {
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
  },

  /**
   * Check if string starts with a prefix
   * @param {string} val
   * @param {string} prefix
   * @returns {boolean}
   */
  startsWith(val, prefix) {
    return typeof val === 'string' && val.toUpperCase().startsWith(prefix.toUpperCase())
  },
}

export default methods
