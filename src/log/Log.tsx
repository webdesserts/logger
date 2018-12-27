import React, { Component } from 'react';
import classes from './Log.module.scss';
import { EntryGrid } from './EntryGrid';
import { EntryForm } from './EntryForm';
import { DayOverview } from './DayOverview'
import { DateTime, Interval } from 'luxon'
import { EntriesProvider, Entry, EntryData, useEntries } from './models/entries';
import { ActiveEntryProvider, ActiveEntryState, useActiveEntry } from './models/active_entry';
import { RouteComponentProps } from '@reach/router'

export { Log, LogProvider }

type Props = RouteComponentProps

function getInterval(entry: Entry) : Interval {
  return Interval.fromDateTimes(entry.start, entry.end || DateTime.local())
}

function Log (props: Props) {
  let active_entry = useActiveEntry()
  let entries = useEntries()
  if (!entries) return <div>Loading...</div>;

  function handleActiveEntryChange (change: Partial<ActiveEntryState>) {
    active_entry.update(change)
  }

  function handleActiveEntryComplete (data: Entry) {
    entries.create(data)
    active_entry.reset()
  }

  function handleEntryUpdate (id: string, change: Partial<EntryData>) {
    entries.update(id, change)
  }

  let day_start = DateTime.local().minus({ days: 0 }).startOf('day')
  let day = Interval.fromDateTimes(day_start, day_start.endOf('day'))
  let day_log = entries.state.filter((entry) => day.intersection(getInterval(entry))).sort((a, b) => b.start.diff(a.start).as('seconds'))

  return (
    <div className={classes.Log}>
      <DayOverview day={day_start} entries={day_log} active_entry={active_entry.state} />
      <EntryGrid entries={entries.state} onUpdate={handleEntryUpdate}>
        <EntryForm active_entry={active_entry.state} onChange={handleActiveEntryChange} onEnd={handleActiveEntryComplete} />
      </EntryGrid>
    </div>
  );
}

type ProviderProps = {
  children: React.ReactChild
}

function LogProvider({ children }: ProviderProps) {
  return (
    <EntriesProvider>
      <ActiveEntryProvider>
        {children}
      </ActiveEntryProvider>
    </EntriesProvider>
  );
}