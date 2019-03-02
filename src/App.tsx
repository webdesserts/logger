import React from 'react'
import { Router } from '@reach/router'
import { Log, LogProvider } from './log/Log'
import DesignSystem from './design-system/DesignSystem'
import { Palette, Subject } from './commands/Palette';
import { useActiveEntry } from './log/models/active_entry';
import { useEntries } from './log/models/entries';

export function App() {
  let active_entry = useActiveEntry()
  let entries = useEntries()
  return (
    <>
      <Palette>
        <Subject type="Entry (Active)" commands={[
          {
            name: 'stop',
            description: 'stops the log',
            onSubmit() {
              active_entry.stop()
            }
          }
        ]} />
        <Subject collection type="Entry" commands={[
          {
            name: 'delete',
            description: 'deletes an entry',
            onSubmit(id) {
              entries.delete(id)
            }
          }
        ]} />
      </Palette>
      <Router>
        <Log path="/" />
        <DesignSystem path="/design" />
      </Router>
    </>
  )
}