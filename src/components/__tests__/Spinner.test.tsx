import { render } from '../../test-utils'
import Spinner from '../Spinner'
import { describe, expect, it } from 'vitest'

describe('Spinner', () => {
  it('renders spinner circle', () => {
    const { container } = render(<Spinner />)
    expect(container.querySelector('.spinner__circle')).toBeInTheDocument()
  })
})
