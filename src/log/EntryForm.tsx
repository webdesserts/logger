import React, { useLayoutEffect } from 'react';
import { Textbox } from '../controls/Textbox';
import { Button } from '../controls/Button';
import { DateTime } from 'luxon';
import { Counter } from './Counter';
import { EntryData, Entry } from './models/entries'
import { ActiveEntryState } from './models/active_entry'
import classes from './EntryGrid.module.scss'

export { EntryForm };

type Props = {
  active_entry: ActiveEntryState
  onChange: (entry: Partial<ActiveEntryState>) => void
  onEnd: (entry: Entry) => void
}

function EntryForm(props: Props) {
  let {
    active_entry,
    onChange = () => {},
    onEnd = () => {}
  } = props

  let sectorBox = React.useRef<HTMLInputElement>(null)
  let descriptionBox = React.useRef<HTMLInputElement>(null)

  useLayoutEffect(() => {
    let $sector = sectorBox.current
    if ($sector) $sector.focus()
  }, [active_entry.id])

  let handleStart = () => {
    onChange({ start: DateTime.local() })
  }

  let handleChange = (prop: keyof EntryData, event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ [prop]: event.target.value })
  }

  let handleStop = () => {
    if (active_entry.start) {
      let completeEntry = { ...active_entry, end: DateTime.local() } as Entry
      console.log(completeEntry)
      onEnd(completeEntry)
    }
    let $description = descriptionBox.current
    if ($description) $description.focus()
  }

  return (
    <>
      <Textbox value={active_entry.sector} onChange={handleChange.bind(null, 'sector')} placeholder="sector" ref={sectorBox}/>
      <Textbox value={active_entry.project} onChange={handleChange.bind(null, 'project')} placeholder="project"/>
      <Textbox value={active_entry.description} onChange={handleChange.bind(null, 'description')} placeholder="description" ref={descriptionBox} />
      {active_entry.start ? <>
        <Textbox readOnly value={active_entry.start.toLocaleString(DateTime.TIME_24_SIMPLE)} />
        <Button autoFocus className={classes.stopBtn} onClick={handleStop}>
          <Counter start={active_entry.start} />
        </Button>
      </> : <>
        <Button className={classes.startBtn} onClick={handleStart}>Start</Button>
      </>}
    </>
  )
}