import React from 'react';
import classes from './Log.module.scss';
import { EntryGrid } from './EntryGrid';
import { DayOverview } from './DayOverview'
import { DateTime, Interval } from 'luxon'
import { EntriesProvider, Entry, useEntries } from './models/entries';
import { ActiveEntryProvider, useActiveEntry } from './models/active_entry';
import { RouteComponentProps } from '@reach/router'

export { Log, LogProvider }

type LogProps = RouteComponentProps

function getInterval(entry: Entry) : Interval {
  return Interval.fromDateTimes(entry.start, entry.end || DateTime.local())
}

function Log (props: LogProps) {
  let active_entry = useActiveEntry()
  let entries = useEntries()

  let day_start = DateTime.local().minus({ days: 0 }).startOf('day')
  let day = Interval.fromDateTimes(day_start, day_start.endOf('day'))
  let day_log = entries.state.filter((entry) => day.intersection(getInterval(entry))).sort((a, b) => b.start.diff(a.start).as('seconds'))

  return (
    <div className={classes.Log}>
      <DayOverview day={day_start} entries={day_log} active_entry={active_entry.state} />
      <EntryGrid activeEntry={active_entry.state} entries={entries.state} />
    </div>
  );
}

type LogProviderProps = {
  children: React.ReactNode
}

function LogProvider({ children }: LogProviderProps) {
  return (
    <EntriesProvider>
      <ActiveEntryProvider>
        <>
        {children}
        </>
      </ActiveEntryProvider>
    </EntriesProvider>
  );
}