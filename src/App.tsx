import React, { Component } from 'react';
import classes from './App.module.scss';
import { EntryGrid } from './EntryGrid';
import { DayOverview } from './DayOverview'
import { DateTime, Interval } from 'luxon'
import { getLog, Entry } from './logs'

type Props = {}
type State = {
  log: null | Entry[]
}

class App extends Component<Props, State> {
  state: State = { log: null }

  async componentDidMount() {
    this.setState({
      log: await getLog()
    })
  } 

  render() {
    let { log } = this.state
    if (!log) return <div>Loading...</div>;

    let day_start = DateTime.local().minus({ days: 1 }).startOf('day')
    let day = Interval.fromDateTimes(day_start, day_start.endOf('day'))
    let todays_log = log.filter((entry) => day.contains(entry.start)).sort((a, b) => b.start.diff(a.start).as('seconds'))

    return (
      <div className={classes.App}>
        <DayOverview day={day_start} entries={todays_log}/>
        <EntryGrid log={todays_log} />
      </div>
    );
  }
}

export default App;

