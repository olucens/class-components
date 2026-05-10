import React, { ReactElement } from 'react'
import { render as rtlRender } from '@testing-library/react'

const AllProviders = ({ children }: { children?: ReactElement }) => {
  return <>{children}</>
}

const render = (ui: ReactElement, options = {}) => rtlRender(ui, { wrapper: AllProviders, ...options })

export * from '@testing-library/react'
export { render }