import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Layout from '../../src/components/layout/Layout'

describe('Layout', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/shop']}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/shop" element={<div data-testid="child">Child</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )
    expect(container).toBeTruthy()
  })

  it('contains skip-to-main-content link when not on editor', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/shop']}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/shop" element={<div>Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )
    const skipLink = getByText('Skip to main content')
    expect(skipLink).toBeInTheDocument()
    expect(skipLink).toHaveAttribute('href', '#main-content')
  })
})
