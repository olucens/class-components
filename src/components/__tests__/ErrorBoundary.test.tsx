import React from 'react'
import { render, screen } from '../../test-utils'
import ErrorBoundary from '../ErrorBoundary'
import { vi } from 'vitest'
import { describe, expect, it } from 'vitest'

function Bomb(): React.JSX.Element {
  throw new Error('boom')
}

describe('ErrorBoundary', () => {
  it('catches error and shows fallback UI', () => {
    const onReset = vi.fn()
    // suppress console.error output for this test
    const original = console.error
    console.error = vi.fn()

    render(
      <ErrorBoundary onReset={onReset}>
        <Bomb />
      </ErrorBoundary>,
    )

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()

    console.error = original
  })
})
