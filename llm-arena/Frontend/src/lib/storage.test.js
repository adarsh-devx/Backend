import { beforeEach, describe, expect, it, vi } from 'vitest'
import { STORAGE_KEY } from '../constants/index.js'
import { readJson, writeJson } from './storage.js'

describe('storage quarantine', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  it('quarantines malformed JSON under a .corrupt key instead of throwing', () => {
    localStorage.setItem(STORAGE_KEY, '{{{not json')

    const parsed = readJson(STORAGE_KEY, [])

    expect(parsed).toEqual([])
    expect(localStorage.getItem(`${STORAGE_KEY}.corrupt`)).toBe('{{{not json')
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    expect(console.warn).toHaveBeenCalled()
  })

  it('returns the provided default when the key is missing', () => {
    expect(readJson('verdict.absent', { a: 1 })).toEqual({ a: 1 })
  })

  it('round-trips a value through writeJson', () => {
    writeJson(STORAGE_KEY, [{ id: 'x' }])
    expect(readJson(STORAGE_KEY, [])).toEqual([{ id: 'x' }])
  })
})
