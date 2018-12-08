import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux'
import classes from './Log.module.scss';
import { EntryGrid } from './EntryGrid';
import { EntryForm } from './EntryForm';
import { DayOverview } from './DayOverview'
import { DateTime, Interval } from 'luxon'
import { selectors } from './store'
import * as entries from './store/entries';
import * as active_entries from './store/active_entry';
import { RouteComponentProps } from '@reach/router'

type ConnectProps = ReturnType<typeof selectors.log>
type Props = ConnectProps & DispatchProp & RouteComponentProps

function getInterval(entry: entries.Entry) : Interval {
  return Interval.fromDateTimes(entry.start, entry.end || DateTime.local())
}

class App extends Component<Props> {
  handleActiveEntryChange = (change: Partial<active_entries.ActiveEntry>) => {
    let { dispatch } = this.props
    let action = active_entries.creators.update(change)
    dispatch(action)
  }

  handleActiveEntryComplete = (data: entries.Entry) => {
    let { dispatch } = this.props
    dispatch(entries.creators.create(data))
    dispatch(active_entries.creators.reset())
  }

  handleEntryUpdate = (id: string, data: Partial<entries.EntryData>) => {
    let { dispatch } = this.props
    dispatch(entries.creators.update(id, data))
  }

  render() {
    let { entries, active_entry } = this.props.log
    if (!entries) return <div>Loading...</div>;

    let day_start = DateTime.local().minus({ days: 0 }).startOf('day')
    let day = Interval.fromDateTimes(day_start, day_start.endOf('day'))
    let day_log = entries.filter((entry) => day.intersection(getInterval(entry))).sort((a, b) => b.start.diff(a.start).as('seconds'))

    return (
      <div className={classes.Log}>
        <DayOverview day={day_start} entries={day_log} active_entry={active_entry} />
        <EntryGrid day={day} entries={entries} onUpdate={this.handleEntryUpdate}>
          <EntryForm entry={active_entry} onChange={this.handleActiveEntryChange} onEnd={this.handleActiveEntryComplete} />
        </EntryGrid>
      </div>
    );
  }
}

export default connect(selectors.log)(App);

