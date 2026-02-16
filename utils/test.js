import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { helpers, netsuite } from '../index.js'

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

describe('helpers.lastDay', () => {
  it('should return the beginning of the last day of the current month', () => {
    const testCases = [
      { date: new Date('2025-03-01'), expected: new Date('2025-03-31T00:00:00.000Z') },
      { date: new Date('2025-11-30T07:00:00.0000000-05:00'), expected: new Date('2025-11-30T00:00:00.000Z') },
      { date: new Date('2025-12-31T23:59:59.999Z'), expected: new Date('2025-12-31T00:00:00.000Z') },
      { date: new Date('2025-02-28T12:59:10.0000000-05:00'), expected: new Date('2025-02-28T00:00:00.000Z') },
    ]
    testCases.forEach(({ date, expected }) => {
      assert.deepStrictEqual(helpers.lastDay(date), expected)
    })

    // Test invalid date separately
    const result = helpers.lastDay('not a date')
    assert.ok(result instanceof Date)
    assert.ok(!isNaN(result.getTime()))
  })
})
