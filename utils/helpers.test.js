import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { helpers } from '../index.js'

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
