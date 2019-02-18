import React from 'react'
import { Router } from '@reach/router'
import { Log, LogProvider } from './log/Log'
import { PaletteProvider } from './commands'
import DesignSystem from './design-system/DesignSystem'
import { Palette, CommandSet } from './commands/Palette';
import { ActiveEntryModel } from './log/models/active_entry';

export function App() {
  return (
    <PaletteProvider>
        <LogProvider>
          <Palette>
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
          </Palette>
          <Router>
            <Log path="/" />
            <DesignSystem path="/design" />
          </Router>
        </LogProvider>
      </PaletteProvider>
  )
}