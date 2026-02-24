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
export function getRecordPath(url: string | string[]): string;
/**
 * Send a request to NetSuite
 * @param {Options} options - Request options
 * @param {Config} config - NetSuite configuration
 * @returns {Promise<import('netsuite-api-client').NetsuiteResponse>}
 */
export function request(options: Options, config: Config): Promise<import("netsuite-api-client").NetsuiteResponse>;
/**
 * Run a SuiteQL query to get a specific (single) NetSuite record.
 * @param {string} query - SuiteQL Query
 * @param {Config} config - NetSuite configuration
 * @returns {Promise<any>}
 */
export function queryRecord(query: string, config: Config): Promise<any>;
/**
 * Run a SuiteQL query against NetSuite records.
 * @param {string} query - SuiteQL Query
 * @param {Config} config - NetSuite configuration
 * @param {?Number} timeout - The timeout in seconds
 * @param {Number} timeoutRecords - The maximum number of records to return before timing out
 * @returns {Promise<Array>}
 */
export function queryRecords(query: string, config: Config, timeout?: number | null, timeoutRecords?: number): Promise<any[]>;
/**
 * Represents the NetSuite OAuth configuration.
 */
export type Config = import("netsuite-api-client").NetsuiteOptions;
/**
 * - Request options
 */
export type Options = import("netsuite-api-client").NetsuiteRequestOptions;
