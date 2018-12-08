import React from 'react'
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

class Counter extends React.Component<Props> {
  static defaultProps = {
    displayUnit: 'minutes'
  }

  int: number = 0;

  componentDidMount() {
    this.int = window.setInterval(this.forceUpdate.bind(this), 1000)
  }

  componentWillUnmount() {
    window.clearInterval(this.int)
  }

  static displayDuration(duration: Duration, displayUnit: 'hours' | 'minutes') : string {
    duration = duration.shiftTo('hours', 'minutes', 'seconds')
    switch(displayUnit) {
      case 'hours': {
        let hours = duration.as('hours')
        let rounded = Math.round(hours * 10) / 10
        return `${rounded}`;
      }
      case 'minutes': {
        return duration.toFormat('h:mm:ss').replace(/^0:/,'')
      }
    }
  }

  render () {
    let { start, add, displayUnit } = this.props

    let now = DateTime.local()
    let duration = add ? now.diff(start).plus(add) : now.diff(start)

    return <>{displayDuration(duration, displayUnit)}</>
  }
}