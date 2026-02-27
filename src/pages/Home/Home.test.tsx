import { render, screen } from '@testing-library/react'

import { Home } from '.'

describe('Home', () => {
  it('renders the button', () => {
    render(<Home />)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })
})
