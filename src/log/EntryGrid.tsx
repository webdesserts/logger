import React from 'react';
import { Textbox } from '../controls/Textbox'
import { Durationbox } from '../controls/Durationbox'
import { Entry, EntriesState } from './stores/entries'
import * as Styles from './EntryGrid.styles'
import { Timebox } from '../controls/Timebox';
import { ActiveEntryState } from './stores/active_entry';
import { Counter } from './Counter';

export { EntryGrid };

interface EntryGridProps {
  activeEntry: ActiveEntryState | null
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
    <Styles.Entries>
      {activeEntry ? <ActiveEntryRow key={activeEntry.id} entry={activeEntry} /> : null}
      {rows}
    </Styles.Entries>
  )
}

interface ActiveEntryRowProps {
  entry: ActiveEntryState
}

function ActiveEntryRow (props: ActiveEntryRowProps) {
  let { entry } = props

  if (entry.start) {
    return (
      <Styles.RowTrigger type="Entry (Active)">
        <Textbox shy readOnly value={entry.sector} />
        <Textbox shy readOnly value={entry.project} />
        <Textbox shy readOnly value={entry.description} />
        <Timebox shy readOnly time={entry.start} />
        <Styles.Field>
          <Counter since={entry.start} />
        </Styles.Field>
      </Styles.RowTrigger>
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
    <Styles.RowTrigger type="Entry" id={entry.id}>
      <Textbox shy readOnly value={entry.sector} />
      <Textbox shy readOnly value={entry.project} />
      <Textbox shy readOnly value={entry.description} />
      <Timebox shy readOnly time={entry.start} />
      <Timebox shy readOnly time={entry.end} />
      <Durationbox shy readOnly value={dur} />
    </Styles.RowTrigger>
  )
}