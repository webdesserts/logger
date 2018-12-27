import React from 'react';
import { Textbox } from '../controls/Textbox'
import { Durationbox } from '../controls/Durationbox'
import { DateTime, Duration } from 'luxon';
import { Entry, EntryData } from './models/entries'
import classes from './EntryGrid.module.scss'
import { Timebox } from '../controls/Timebox';

export { EntryGrid };

type EntryGridProps = {
  entries: Entry[]
  children: React.ReactNode
  onUpdate: (id: string, changes: Partial<EntryData>) => void
}

function EntryGrid (props: EntryGridProps) {
  let { entries, children, onUpdate } = props
  let rows = entries.map((entry) => (
    <EntryRow key={entry.id} entry={entry} onUpdate={onUpdate}/>
  ))

  return (
    <div className={classes.entries}>
      {children}
      {rows}
    </div>
  )
}

type EntryRowProps = {
  entry: Entry
  onUpdate: (id: string, changes: Partial<EntryData>) => void
}

function EntryRow (props: EntryRowProps) {
  let { entry, onUpdate } = props
  let dur = entry.end.diff(entry.start)

  function handleUpdate (prop: keyof EntryData, event: React.ChangeEvent<HTMLInputElement>) {
    onUpdate(entry.id, { [prop]: event.target.value })
  }

  function handleDurationChange (dur: Duration) {
    let end = entry.start.plus(dur)
    onUpdate(entry.id, { end })
  }

   function handleTimeChange (prop: 'start' | 'end', time: DateTime) {
    onUpdate(entry.id, { [prop]: time })
  }

  return <>
    <Textbox shy value={entry.sector} onChange={handleUpdate.bind(null, 'sector')}/>
    <Textbox shy value={entry.project} onChange={handleUpdate.bind(null, 'project')}/>
    <Textbox shy value={entry.description} onChange={handleUpdate.bind(null, 'description')}/>
    <Timebox shy time={entry.start} onChange={handleTimeChange.bind(null, 'start')} />
    <Timebox shy time={entry.end} onChange={handleTimeChange.bind(null, 'end')} />
    <Durationbox shy value={dur} onChange={handleDurationChange} />
  </>
}