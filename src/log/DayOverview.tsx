import React from 'react';
import classes from './Log.module.scss';
import { Counter } from './Counter';
import { DateTime, Duration } from 'luxon';
import { ActiveEntryState } from './models/active_entry';
import { EntriesState } from './models/entries';

type DayOverviewProps = {
  day: DateTime,
  entries: EntriesState,
  active_entry: ActiveEntryState
}

function DayOverview ({ day, entries, active_entry } : DayOverviewProps) {
  let duration = entries.reduce((total, { start, end }) => {
    if (end) total.plus(end.diff(start))
    return total
  }, Duration.fromMillis(0))
  let hours = Math.round(duration.as('hours') * 100) / 100

  return (
    <div className={classes.overview}>
      <h1 className={classes.header}>{day.toLocaleString(DateTime.DATE_HUGE)}</h1>
      <div className={classes.stats}>
        <div className={classes.field}>
          <div className={classes.fieldLabel}>Day</div>
          <div className={classes.fieldItem}>
            {active_entry.start ? <Counter start={active_entry.start} add={duration} displayUnit='hours'/> : hours} hrs | {entries.length} logs
          </div>
        </div>
        <div className={classes.field}>
          <div className={classes.fieldLabel}>Average</div>
          <div className={classes.fieldItem}>3.2 hrs | 5 logs | .3 hrs/log</div>
        </div>
      </div>
    </div>
  )
}

export { DayOverview };