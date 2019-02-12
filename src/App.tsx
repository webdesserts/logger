import React from 'react'
import { Router } from '@reach/router'
import { Log, LogProvider } from './log/Log'
import { CommandContextProvider } from './commands'
import DesignSystem from './design-system/DesignSystem'
import { CommandPalette, CommandSet } from './commands/CommandPalette';
import { ActiveEntryModel } from './log/models/active_entry';

export function App() {
  return (
    <CommandContextProvider>
      <LogProvider>
        <CommandPalette>
          <CommandSet<ActiveEntryModel> subject="Entry (Active)" commands={[
            {
              name: 'start',
              description: 'starts the log',
              onSubmit(active_entry) { active_entry.start() }
            }, {
              name: 'stop',
              description: 'stops the log',
              onSubmit(active_entry) { active_entry.stop() }
            },
          ]} />
        </CommandPalette>
        <Router>
          <Log path="/" />
          <DesignSystem path="/design" />
        </Router>
      </LogProvider>
    </CommandContextProvider>
  )
}