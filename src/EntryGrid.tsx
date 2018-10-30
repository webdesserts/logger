import React from 'react';
import { Textbox } from './controls/Textbox';
import { Button } from './controls/Button';
import { DateTime } from 'luxon';
import { Entry, IncompleteEntry } from './logs'
import { Counter } from './Counter';
import classes from './EntryGrid.module.scss'

type EntryGridProps = {
  log: Entry[]
}

function EntryGrid (props: EntryGridProps) {
  let { log } = props
  let rows = log.map((entry) => (
    <EntryRow entry={entry} />
  ))

  return (
    <div className={classes.entries}>
      <CreateEntryForm />
      {rows}
    </div>
  )
}
    
type EntryRowProps = {
  entry: Entry
}

function EntryRow (props: EntryRowProps) {
  let { sector, project, description, start, end } = props.entry
  let dur = end ? end.diff(start) : null
  return <>
    <div>{sector}</div>
    <div>{project}</div>
    <div>{description}</div>
    <div>{start.toLocaleString(DateTime.TIME_24_SIMPLE)}</div>
    <div>{end ? end.toLocaleString(DateTime.TIME_24_SIMPLE) : null}</div>
    <div>{dur ? Math.round(dur.as('hours') * 100) / 100 : <Counter date={start} />}</div>
  </>
}

type CreateEntryForm = {
}

function CreateEntryForm (props: CreateEntryForm) {
  return <>
    <Textbox />
    <Textbox />
    <Textbox />
    <Button className={classes.startBtn}>Start</Button>
  </>
}

export { EntryGrid };