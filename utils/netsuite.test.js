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

describe('netsuite.queryRecords', () => {
  it('should get the requested records', async (testContext) => {
    if (!process.env.NETSUITE_CONFIG_DEV) {
      testContext.skip('NETSUITE_CONFIG_DEV not defined, skipping test')
      return
    }
    const config = JSON.parse(process.env.NETSUITE_CONFIG_DEV)
    const query = `
      SELECT exchangerate
      FROM currencyrate
      WHERE basecurrency = 1
        AND ROWNUM <= 2;
    `

    const response = await netsuite.queryRecords(query, config, 30)
    assert.equal(response.length, 2)
    assert.ok(
      Object.prototype.hasOwnProperty.call(response[0], 'exchangerate'),
      'Did not find the expected field in the response. Did the call succeed?',
    )
  })
})

describe('netsuite.queryRecord', () => {
  it('should get the requested record', async (testContext) => {
    if (!process.env.NETSUITE_CONFIG_DEV) {
      testContext.skip('NETSUITE_CONFIG_DEV not defined, skipping test')
      return
    }
    const config = JSON.parse(process.env.NETSUITE_CONFIG_DEV)
    const query = `
      SELECT exchangerate
      FROM currencyrate
      WHERE basecurrency = 1
        AND ROWNUM <= 2;
    `

    const response = await netsuite.queryRecord(query, config)
    assert.ok(
      Object.prototype.hasOwnProperty.call(response, 'exchangerate'),
      'Did not find the expected field in the response. Did the call succeed?',
    )
  })
})

describe('netsuite.request', () => {
  it('should get the requested custom record', async (testContext) => {
    if (!process.env.NETSUITE_CONFIG_DEV) {
      testContext.skip('NETSUITE_CONFIG_DEV not defined, skipping test')
      return
    }
    const config = JSON.parse(process.env.NETSUITE_CONFIG_DEV)

    const response = await netsuite.request(
      {
        method: 'GET',
        path: '/record/v1/customrecord_cseg3/4670',
        body: '',
      },
      config,
    )

    assert.strictEqual(response.data.id, '4670')
  })

  it('should get the requested customer', async (testContext) => {
    if (!process.env.NETSUITE_CONFIG_DEV) {
      testContext.skip('NETSUITE_CONFIG_DEV not defined, skipping test')
      return
    }
    const config = JSON.parse(process.env.NETSUITE_CONFIG_DEV)

    const response = await netsuite.request(
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

describe('suiteqlString', () => {
  it('returns empty string literal for null/undefined', () => {
    assert.equal(netsuite.sqlString(null), "''")
    assert.equal(netsuite.sqlString(undefined), "''")
  })

  it('wraps regular strings in single quotes', () => {
    assert.equal(netsuite.sqlString('abc'), "'abc'")
    assert.equal(netsuite.sqlString(''), "''")
  })

  it('escapes single quotes by doubling them', () => {
    assert.equal(netsuite.sqlString("O'Brien"), "'O''Brien'")
    assert.equal(netsuite.sqlString("a'b'c"), "'a''b''c'")
  })

  it('does not special-case double quotes or backticks', () => {
    assert.equal(netsuite.sqlString('he said "hi"'), `'he said "hi"'`)
    assert.equal(netsuite.sqlString('use `code`'), "'use `code`'")
  })

  it('removes NUL characters defensively', () => {
    assert.equal(netsuite.sqlString('a\u0000b'), "'ab'")
  })

  it('stringifies non-strings', () => {
    assert.equal(netsuite.sqlString(123), "'123'")
    assert.equal(netsuite.sqlString(true), "'true'")
  })
})
