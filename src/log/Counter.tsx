import React, { useEffect, useState } from 'react'
import { DateTime, Duration } from 'luxon'

export { Counter, displayDuration };

type Props = {
  start: DateTime,
  add?: Duration,
  displayUnit: 'hours' | 'minutes'
}

function displayDuration(duration: Duration, displayUnit: 'hours' | 'minutes'): string {
  duration = duration.shiftTo('hours', 'minutes', 'seconds')
  switch (displayUnit) {
    case 'hours': {
      let hours = duration.as('hours')
      let rounded = Math.round(hours * 10) / 10
      return `${rounded}`;
    }
    case 'minutes': {
      return duration.toFormat('h:mm:ss').replace(/^0:/, '')
    }
  }
}

function Counter(props: Props) {
  let [ now, setNow ] = useState(DateTime.local())

  useEffect(() => {
    let int = window.setInterval(() => setNow(DateTime.local()), 1000)
    return () => window.clearInterval(int)
  })

  let duration = props.add ? now.diff(props.start).plus(props.add) : now.diff(props.start)

  return <>{displayDuration(duration, props.displayUnit)}</>
}

Counter.defaultProps = {
  displayUnit: 'minutes'
}