import assert from 'node:assert/strict'
import { loadEnvFile } from 'node:process'
import { describe, it } from 'node:test'
import { netsuite } from '../index.js'

try {
  loadEnvFile('.env')
} catch (error) {
  if (error.code === 'ENOENT') {
    console.log('No env file found, proceeding without it')
  } else {
    throw error
  }
}

describe('netsuite.getRecordPath', () => {
  it('should get the record path from the URL', () => {
    const testCases = [
      {
        row: 'https://3308420-sb1.suitetalk.api.netsuite.com/services/rest/record/v1/invoice/897889',
        expected: '/record/v1/invoice/897889',
      },
      {
        row: 'https://3308420.suitetalk.api.netsuite.com/services/rest/record/v1/journalentry/1114292',
        expected: '/record/v1/journalentry/1114292',
      },
    ]
    testCases.forEach(({ row, expected }) => {
      assert.strictEqual(netsuite.getRecordPath(row), expected)
    })
  })
})

describe('netsuite.request', () => {
  it('should be able to call NetSuite', async (testContext) => {
    if (!process.env.NETSUITE_CONFIG_DEV) {
      testContext.skip('NETSUITE_CONFIG_DEV not defined, skipping test')
      return
    }
    const config = JSON.parse(process.env.NETSUITE_CONFIG_DEV)
    const testCases = [
      {
        name: 'Get the requested custom record',
        options: {
          method: 'GET',
          path: '/record/v1/customrecord_cseg3/4670',
          body: '',
        },
        isExpected: (response) => response.data.id === '4670',
      },
      {
        name: 'Update the specified customer',
        options: {
          method: 'PATCH',
          path: '/record/v1/customer/4216',
          body: '{"isInactive":false}',
        },
        isExpected: (response) => response.statusCode === 204,
      }
    ]

    for (const { name, options, isExpected } of testCases) {
      const response = await netsuite.request(options, config)
      assert.ok(isExpected(response), 'Failed test: ' + name)
    }
  })
})
