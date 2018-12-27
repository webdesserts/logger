import React from 'react'
import { Router } from '@reach/router'
import { Log, LogProvider } from './log/Log'
import { ContextsProvider } from './commands'
import DesignSystem from './design-system/DesignSystem'

export class App extends React.Component {
  render () {
    return (
      <ContextsProvider>
        <LogProvider>
          <Router>
            <Log path="/" />
            <DesignSystem path="/design" />
          </Router>
        </LogProvider>
      </ContextsProvider>
    )
  }
}