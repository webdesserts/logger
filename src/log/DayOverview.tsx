import React from 'react';
import * as Styles from './Log.styles';
import { DateTime, Duration } from 'luxon';
import { ActiveEntryState } from './stores/active_entry';
import { EntriesState } from './stores/entries';
import { Counter } from './Counter';

export { DayOverview };

type DayOverviewProps = {
  day: DateTime,
  entries: EntriesState,
  active_entry: ActiveEntryState | null
}

function DayOverview ({ day, entries, active_entry } : DayOverviewProps) {
  let duration = entries.reduce((total, { start, end }) => {
    if (end) total.plus(end.diff(start))
    return total
  }, Duration.fromMillis(0))
  let hours = Math.round(duration.as('hours') * 100) / 100

  return (
    <Styles.Overview>
      <Styles.Header>{day.toLocaleString(DateTime.DATE_HUGE)}</Styles.Header>
      <Styles.Stats>
        <Styles.Field>
          <Styles.FieldLabel>Day</Styles.FieldLabel>
          <Styles.FieldItem>
            {active_entry ? <Counter since={active_entry.start} plus={duration} displayUnit='hours'/> : hours} hrs | {entries.length} logs
          </Styles.FieldItem>
        </Styles.Field>
        <Styles.Field>
          <Styles.FieldLabel>Average</Styles.FieldLabel>
          <Styles.FieldItem>3.2 hrs | 5 logs | .3 hrs/log</Styles.FieldItem>
        </Styles.Field>
      </Styles.Stats>
    </Styles.Overview>
  )
}