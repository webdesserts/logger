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
          }} onSubmit={(data) => {
            active_entry.start(data)
          }}/>
        </Subject>

        <Subject type="Entry (Active)">
          <Command name="stop" description="stops the log" onSubmit={() => {
            let entry = active_entry.stop()
            if (entry) entries.create(entry)
          }} />
        </Subject>

        <Subject.WithId type="Entry">{(id: string) => {
          let entry = entries.find(id)

          // TODO: why are we hitting this after delete?
          // if (!entry) throw Error(`Could not find entry with id: ${id}`)
          if (!entry) return null

          return <>
            <Command name="delete" description="deletes an entry" onSubmit={() => entries.delete(id)} />
            <Command name="edit" description="Edits an existing Entry"
              params={{
                sector: { type: 'string', required: true, defaultValue: entry.sector },
                project: { type: 'string', required: true, defaultValue: entry.project },
                description: { type: 'string', required: true, defaultValue: entry.description },
              }}
              onSubmit={(data) => {
                entries.update(id, data)
              }}
            />
          </>
        }}
        </Subject.WithId>
      </Palette>
      <Router>
        <Log path="/" />
        <DesignSystem path="/design" />
      </Router>
    </>
  )
}