import assert from 'node:assert/strict'
import { test } from 'node:test'
import { generatePasswords, PATTERN_GROUPS, RANDOM_LENGTHS } from './passwords.js'

test('generates all 14 passwords with the exact requested patterns and lengths', () => {
  const tokens = { 0: '[0-9]', a: '[a-z]', A: '[A-Z]', $: '[!@#$%&]' }
  for (let run = 0; run < 100; run++) {
    const groups = generatePasswords()
    assert.deepEqual(groups.map((group) => group.length), [3, 3, 3, 5])
    PATTERN_GROUPS.forEach((patterns, groupIndex) => {
      patterns.forEach((pattern, index) => {
        const regex = new RegExp(`^${[...pattern].map((token) => tokens[token]).join('')}$`)
        assert.match(groups[groupIndex][index], regex)
      })
    })
    groups[3].forEach((password, index) => {
      assert.equal(password.length, RANDOM_LENGTHS[index])
      assert.match(password, /^[a-zA-Z0-9!@#$%&]+$/)
      for (const category of [/[a-z]/, /[A-Z]/, /[0-9]/, /[!@#$%&]/]) {
        assert.match(password, category)
      }
    })
  }
})

test('generates a fresh set of passwords', () => {
  assert.notDeepEqual(generatePasswords(), generatePasswords())
})
