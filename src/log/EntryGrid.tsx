import React from 'react';
import { Textbox } from '../controls/Textbox'
import { Durationbox } from '../controls/Durationbox'
import { DateTime, Interval, Duration } from 'luxon';
import { Entry, EntryData } from './models/entries'
import classes from './EntryGrid.module.scss'
import { Timebox } from '../controls/Timebox';

type EntryGridProps = {
  day: Interval,
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

type AnyChangeHandler<P extends keyof EntryData = keyof EntryData> = (prop: P, event: React.ChangeEvent<HTMLInputElement>) => void

function EntryRow (props: EntryRowProps) {
  let { entry, onUpdate } = props
  let dur = entry.end.diff(entry.start)

  let handleUpdate: AnyChangeHandler = (prop, event) => {
    onUpdate(entry.id, { [prop]: event.target.value })
  }

  let handleDurationChange = (dur: Duration) => {
    let end = entry.start.plus(dur)
    onUpdate(entry.id, { end })
  }

  let handleTimeChange = (prop: 'start' | 'end', time: DateTime) => {
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

export { EntryGrid };