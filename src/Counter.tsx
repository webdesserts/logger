import React from 'react'
import { DateTime } from 'luxon'

type Props = {
  date: DateTime,
  add?: number,
}

class Counter extends React.Component<Props> {
  int: number = 0;
  componentDidMount() {
    this.int = window.setInterval(this.forceUpdate.bind(this), 1000)
  }
  componentWillUnmount() {
    window.clearInterval(this.int)
  }
  render () {
    let { date, add } = this.props
    let now = DateTime.local()
    let hours = now.diff(date).as('hours')
    if (add) hours += add

    let rounded = Math.round(hours * 100) / 100
    return <>{rounded}</>
  }
}

export { Counter };