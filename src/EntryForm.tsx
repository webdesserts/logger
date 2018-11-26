import React from 'react';
import { Textbox } from './controls/Textbox';
import { Button } from './controls/Button';
import { DateTime } from 'luxon';
import { Counter } from './Counter';
import { EntryData, Entry } from './store/entries'
import { ActiveEntry } from './store/active_entry'
import classes from './EntryGrid.module.scss'

type Props = {
  entry: ActiveEntry
  onChange: (entry: Partial<ActiveEntry>) => void
  onEnd: (entry: Entry) => void
}

class EntryForm extends React.Component<Props> {
  static defaultProps = {
    onChange: () => {},
    onEnd: () => {}
  }

  sectorBox = React.createRef<HTMLInputElement>()
  descriptionBox = React.createRef<HTMLInputElement>()

  componentDidMount () {
    let $sector = this.sectorBox.current
    if ($sector) $sector.focus()
  }

  handleStart = () => {
    let times = { start: DateTime.local() }
    let newEntry = Object.assign({}, this.state, times)

    this.props.onChange(newEntry)
  }

  handleChange = (prop: keyof EntryData, event: React.ChangeEvent<HTMLInputElement>) => {
    let changes = { [prop]: event.target.value }
    this.props.onChange(changes)
  }

  handleStop = () => {
    let { entry } = this.props
    if (entry.start) {
      let completeEntry = { ...entry, end: DateTime.local() } as Entry
      console.log(completeEntry)
      this.props.onEnd(completeEntry)
    }
    let $description = this.descriptionBox.current
    if ($description) $description.focus()
  }

  render() {
    let { entry } = this.props;

    return (
      <>
        <Textbox value={entry.sector} onChange={this.handleChange.bind(this, 'sector')} placeholder="sector" ref={this.sectorBox}/>
        <Textbox value={entry.project} onChange={this.handleChange.bind(this, 'project')} placeholder="project"/>
        <Textbox value={entry.description} onChange={this.handleChange.bind(this, 'description')} placeholder="description" ref={this.descriptionBox} />
        {entry.start ? <>
          <Textbox readOnly value={entry.start.toLocaleString(DateTime.TIME_24_SIMPLE)} />
          <Button autoFocus className={classes.stopBtn} onClick={this.handleStop}><Counter start={entry.start} /></Button>
        </> : <>
          <Button className={classes.startBtn} onClick={this.handleStart}>Start</Button>
        </>}
      </>
    )
  }
}

export { EntryForm };