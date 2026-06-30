import { describe, it, expect } from 'vitest'

describe('Example Unit Test', () => {
  it('demonstrates basic unit testing with Vitest', () => {
    const sum = (a: number, b: number) => a + b
    expect(sum(1, 2)).toBe(3)
  })

  it('demonstrates assertions', () => {
    const obj = { a: 1, b: 2 }
    expect(obj).toHaveProperty('a')
    expect(obj.a).toEqual(1)
  })
})
