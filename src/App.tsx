import React from 'react'
import { Router } from '@reach/router'
import { Log } from './log/Log'
import DesignSystem from './design-system/DesignSystem'
import { Palette, Subject, Command } from './commands/Palette';
import { useActiveEntry } from './log/models/active_entry';
import { useEntries } from './log/models/entries';

export function App() {
  let active_entry = useActiveEntry()
  let entries = useEntries()
  return (
    <>
      <Palette>
        <Subject type="Log">
          <Command name="start" description="Starts a new Entry" params={{
            sector: { type: 'string', required: true },
            project: { type: 'string', required: true },
            description: { type: 'string', required: true },
          }} onSubmit={(id, data) => {
            active_entry.start(data)
          }}/>
        </Subject>

        <Subject type="Entry (Active)">
          <Command name="stop" description="stops the log" onSubmit={() => {
            let entry = active_entry.stop()
            if (entry) entries.create(entry)
          }} />
        </Subject>

        <Subject type="Entry">
          <Command.WithId name="delete" description="deletes an entry" onSubmit={(id) => entries.delete(id)} />
        </Subject>
      </Palette>
      <Router>
        <Log path="/" />
        <DesignSystem path="/design" />
      </Router>
    </>
  )
}