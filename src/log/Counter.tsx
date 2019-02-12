import React, { useEffect, useState } from 'react'
import { DateTime, Duration } from 'luxon'

export { Counter, durationToString };

type Props = {
  since: DateTime,
  plus: Duration,
  displayUnit: 'hours' | 'minutes'
}

function durationToString(duration: Duration, displayUnit: 'hours' | 'minutes'): string {
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
  let duration = useCounter(props.since, props.plus)
  return <>{durationToString(duration, props.displayUnit)}</>
}

Counter.defaultProps = {
  displayUnit: 'minutes',
  plus: Duration.fromMillis(0)
}

function useCounter(since: DateTime, plus = Duration.fromMillis(0)) : Duration {
  let [ now, setNow ] = useState(DateTime.local())

  useEffect(() => {
    let int = window.setInterval(() => setNow(DateTime.local()), 1000)
    return () => window.clearInterval(int)
  })

  return now.diff(since).plus(plus)
}