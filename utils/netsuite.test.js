import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { netsuite } from '../index.js'

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

describe('netsuite.netsuiteRequest', () => {
  it('should submit a request to NetSuite', async (testContext) => {
    if (!process.env.NETSUITE_CONFIG_DEV) {
      testContext.skip('NETSUITE_CONFIG_DEV not defined, skipping test')
      return
    }
    const config = JSON.parse(process.env.NETSUITE_CONFIG_DEV)
    let response

    response = await netsuite.netsuiteRequest(
      { method: 'GET', path: '/record/v1/customrecord_cseg3/4670', body: '' },
      config,
    )
    assert.strictEqual(response.data.id, '4670')

    response = await netsuite.netsuiteRequest(
      {
        method: 'PATCH',
        path: '/record/v1/customer/4216',
        body: '{"isInactive":false}',
      },
      config,
    )
    assert.strictEqual(response.statusCode, 204)
  })
})
