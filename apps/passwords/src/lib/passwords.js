const CHARACTERS = {
  0: '0123456789',
  a: 'abcdefghijklmnopqrstuvwxyz',
  A: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  $: '!@#$%&',
}

export const PATTERN_GROUPS = [
  ['00aa00aa', '00aa00aa00aa', '00aa00aa00aa00aa'],
  ['00aa00aA', '00aa00aa00aA', '00aa00aa00aa00aA'],
  ['00aa00aA$', '00aa00aa00aA$', '00aa00aa00aa00aA$'],
]

export const RANDOM_LENGTHS = [8, 12, 16, 24, 32]

function randomCharacter(alphabet) {
  // Reject the remainder to avoid modulo bias when mapping bytes to characters.
  const limit = 256 - (256 % alphabet.length)
  const byte = new Uint8Array(1)
  do {
    globalThis.crypto.getRandomValues(byte)
  } while (byte[0] >= limit)
  return alphabet[byte[0] % alphabet.length]
}

function fromPattern(pattern) {
  return Array.from(pattern, (token) => randomCharacter(CHARACTERS[token])).join('')
}

function randomPassword(length) {
  const alphabets = Object.values(CHARACTERS)
  const alphabet = alphabets.join('')
  let password
  // Keep every category represented without fixing any character's position.
  do {
    password = Array.from({ length }, () => randomCharacter(alphabet)).join('')
  } while (!alphabets.every((characters) => [...password].some((char) => characters.includes(char))))
  return password
}

export function generatePasswords() {
  return [
    ...PATTERN_GROUPS.map((patterns) => patterns.map(fromPattern)),
    RANDOM_LENGTHS.map(randomPassword),
  ]
}
