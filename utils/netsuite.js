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

const handle_timeout = (start, count) => {
  const duration = Date.now() - start
  if (this.timeout && duration >= this.timeout * 1000) {
    console.error(`Timeout reached at ${duration / 1000} seconds`)
    return true
  }

  if (this.timeout_records && count >= this.timeout_records) {
    console.error(`Timeout reached at ${count} records in ${duration / 1000} seconds`)
    return true
  }

  return false
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
 * Run a SuiteQL query to get a specific (single) NetSuite records.
 * @param {string} query
 * @param {Config} config - NetSuite configuration
 * @returns {Promise<any>}
 */
export async function queryRecord(query, config) {
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

/**
 * Run a SuiteQL query against NetSuite records.
 * @param {string} query - SuiteQL Query
 * @param {Config} config - NetSuite configuration
 * @param {Number} timeout - The timeout in seconds
 * @param {Number} timeoutRecords - The maximum number of records to return before timing out
 * @returns {Promise<any>}
 */
export async function queryRecords(query, config, timeout, timeoutRecords) {
  const client = new NetsuiteApiClient(JSON.parse(this.config));
  const limit = Math.min(1000, this.timeout_records)
  let offset = 0
  const start = Date.now()
  let response = {}

  try {
    let items = []
    do {
      response = await client.query(this.query, limit, offset)
      items = items.concat(response.items)
      offset += limit

      if (await this.handle_timeout(start, items.length)) {
        break
      }
    } while (response.hasMore)

    $.export(
      "$summary",
      `Successfully ran SuiteQL query`
    );
    return items;
  } catch (error) {
    console.error(
      "NetSuite API Error:",
      error.response?.data || error.message
    );
    throw new Error(
      `Failed to execute SuiteQL query: ${
        error.response?.data?.detail || error.message
      }`
    );
  }
}
