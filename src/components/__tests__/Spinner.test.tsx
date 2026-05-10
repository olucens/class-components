import { render } from '../../test-utils'
import Spinner from '../Spinner'

describe('Spinner', () => {
  it('renders spinner circle', () => {
    const { container } = render(<Spinner />)
    expect(container.querySelector('.spinner__circle')).toBeInTheDocument()
  })
})
