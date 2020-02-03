import React, { useEffect } from 'react';
import * as Styles from './Log.styles';
import { EntryGrid } from './EntryGrid';
import { DayOverview } from './DayOverview'
import { DateTime, Interval } from 'luxon'
import { EntriesProvider, Entry, useEntries, EntriesStore } from './stores/entries';
import { ActiveEntryProvider, useActiveEntry, ActiveEntryStore } from './stores/active_entry';
import { RouteComponentProps } from '@reach/router'
import { useSubjectTrigger } from '../commands';
import { useUser } from './stores/user';

export { Log, LogProvider }

type LogProps = RouteComponentProps

function getInterval(entry: Entry) : Interval {
  return Interval.fromDateTimes(entry.start, entry.end || DateTime.local())
}

function Log (props: LogProps) {
  let user = useUser()
  let { isAuthenticated } = user.state
  let activeEntry = useActiveEntry()
  let entries = useEntries()
  useSubjectTrigger('Log', { enabled: user.state.isAuthenticated })

  useEffect(() => {
    if (isAuthenticated) {
      activeEntry.fetch(user)
      entries.fetchAll(user)
    }
  }, [isAuthenticated])

  if (!isAuthenticated) return null

  let day_start = DateTime.local().minus({ days: 0 }).startOf('day')
  let day = Interval.fromDateTimes(day_start, day_start.endOf('day'))
  let day_log = entries.state.filter((entry) => day.intersection(getInterval(entry))).sort((a, b) => b.start.diff(a.start).as('seconds'))

  return (
    <Styles.Log>
      <DayOverview day={day_start} entries={day_log} active_entry={activeEntry.state} />
      <EntryGrid activeEntry={activeEntry.state} entries={entries.state} />
    </Styles.Log>
  );
}

type LogProviderProps = {
  children: React.ReactNode
}

function LogProvider({ children }: LogProviderProps) {
  let entries = EntriesStore.useState(EntriesStore.initialState)
  let activeEntry = ActiveEntryStore.useState(ActiveEntryStore.initialState)

  return (
    <EntriesProvider store={entries}>
      <ActiveEntryProvider store={activeEntry}>
        <>{children}</>
      </ActiveEntryProvider>
    </EntriesProvider>
  );
}