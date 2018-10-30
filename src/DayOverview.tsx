import React from 'react';
import classes from './App.module.scss';
import { Counter } from './Counter';
import { DateTime } from 'luxon';
import { Entry } from './logs'

type DayOverviewProps = {
  day: DateTime,
  entries: Array<Entry>
}

function DayOverview ({ day, entries } : DayOverviewProps) {
  let hours = entries.reduce((total, { start, end }) => {
    if (end) total += end.diff(start).as('hours')
    return total
  }, 0)
  let active = entries.find((entry) => !entry.end)
  let rounded = Math.round(hours * 100) / 100
  let logs = entries.length
  let per_log = rounded ? Math.round(rounded/logs* 100) / 100 : 0

  return (
    <div className={classes.overview}>
      <h1 className={classes.header}>{day.toLocaleString(DateTime.DATE_HUGE)}</h1>
      <div className={classes.stats}>
        <div className={classes.field}>
          <div className={classes.fieldLabel}>Day</div>
          <div className={classes.fieldItem}>
            {active ? <Counter add={rounded} date={active.start}/> : rounded} hrs | {logs} logs | {per_log} hrs/log
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