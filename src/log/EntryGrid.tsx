import React from 'react';
import { Textbox } from '../controls/Textbox'
import { Durationbox } from '../controls/Durationbox'
import { Entry, EntriesState } from './models/entries'
import classes from './EntryGrid.module.scss'
import { Timebox } from '../controls/Timebox';
import { ActiveEntryState } from './models/active_entry';
import { Trigger } from '../commands/PaletteTrigger'
import { Counter } from './Counter';

export { EntryGrid };

interface EntryGridProps {
  activeEntry: ActiveEntryState
  entries: EntriesState
}

function sortEntriesByStart(a: Entry, b: Entry) {
  return a.start.diff(b.start).milliseconds
}

function EntryGrid (props: EntryGridProps) {
  let { activeEntry, entries } = props
  let rows = entries.sort(sortEntriesByStart).map((entry) => (
    <EntryRow key={entry.id} entry={entry} />
  ))

  return (
    <div className={classes.entries}>
      <ActiveEntryRow key={activeEntry.id} entry={activeEntry} />
      {rows}
    </div>
  )
}

interface ActiveEntryRowProps {
  entry: ActiveEntryState
}

function ActiveEntryRow (props: ActiveEntryRowProps) {
  let { entry } = props

  if (entry.start) {
    return (
      <Trigger type="Entry (Active)" className={classes.row_active}>
        <Textbox shy readOnly value={entry.sector} />
        <Textbox shy readOnly value={entry.project} />
        <Textbox shy readOnly value={entry.description} />
        <Timebox shy readOnly time={entry.start} />
        <div className={classes.field}>
          <Counter since={entry.start} />
        </div>
      </Trigger>
    )
  } else {
    return null
  }
}

interface EntryRowProps {
  entry: Entry
}

function EntryRow (props: EntryRowProps) {
  let { entry } = props
  let dur = entry.end.diff(entry.start)

  return (
    <Trigger type="Entry" id={entry.id} className={classes.row}>
      <Textbox shy readOnly value={entry.sector} />
      <Textbox shy readOnly value={entry.project} />
      <Textbox shy readOnly value={entry.description} />
      <Timebox shy readOnly time={entry.start} />
      <Timebox shy readOnly time={entry.end} />
      <Durationbox shy readOnly value={dur} />
    </Trigger>
  )
}