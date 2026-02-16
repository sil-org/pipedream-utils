import { NetsuiteApiClient } from 'netsuite-api-client'

/**
 * Represents the NetSuite OAuth configuration.
 * @typedef {import('netsuite-api-client').NetsuiteOptions} Config
 */

/**
 * Options for a NetSuite request. See https://github.com/julbrs/netsuite-api-client/blob/main/src/types.ts
 * @typedef {import('netsuite-api-client').NetsuiteRequestOptions} Options - Request options
 */

/**
 * Gets the portion of the URL starting with '/record'. Used to obtain a GET query path from the "location" response
 * header on a NetSuite POST request.
 * @param {string | string[]} url
 * @returns {string}
 */
export function getRecordPath(url) {
  const u = Array.isArray(url) ? url[0] : url
  const startIndex = u.indexOf('/record')
  if (startIndex === -1) {
    return u
  }
  return u.substring(startIndex)
}

/**
 * Send a request to NetSuite
 * @param {Options} options - Request options
 * @param {Config} config - NetSuite configuration
 * @returns {Promise<import('netsuite-api-client').NetsuiteResponse>}
 */
export async function request(options, config) {
  const client = new NetsuiteApiClient(config)

  try {
    const response = await client.request(options)
    // After a POST request to a '/record' path, make a GET call to retrieve the new record.
    if (options.method === 'POST' && options?.path?.startsWith('/record') && response.headers['location']) {
      options.method = 'GET'
      options.path = getRecordPath(response.headers['location'])
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
}

/**
 * Query Netsuite.
 * @param {string} query
 * @param {Config} config - NetSuite configuration
 * @returns {Promise<any>}
 */
export async function netsuiteQueryRecords(query, config) {
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
}
