import React, { useState, ChangeEventHandler, KeyboardEvent, } from 'react'
import classes from './CommandPalette.module.scss'
import { useCommandContext, CommandContextState } from './model';

export { CommandPalette }

/*================*\
*  CommandPalette  *
\*================*/

type Command<T> = { subject: string, name: string, description: string, onSubmit: (model: T) => void }
interface CommandSetElement<T> extends React.ReactElement<CommandSetProps<T>, typeof CommandSet> {}
type Props<T> = {
  children?: CommandSetElement<T> | CommandSetElement<T>[]
}

function CommandPalette<T>(props: Props<T>) {
  let context = useCommandContext()
  console.log('context:', context.state)
  let subjects = new Set<string>();
  let commands = [] as Command<T>[];
  let [search, setSearch] = useState("")
  let [selection, setSelection] = useState(0)

  let children: React.ReactElement<CommandSetProps<T>, typeof CommandSet>[] = []
  children = children.concat(props.children || [])

  for (let child of children) {
    let commandSet = child.props
    subjects.add(commandSet.subject)
    for (let command of commandSet.commands) {
      commands.push(Object.assign({ subject: commandSet.subject }, command))
    }
  }

  let matchingCommands = commands
    .filter(matchesContext(subjects))
    .filter(matchesSearch(search))
    .sort(sortSubjectsByDepth(context.state))

  function handleKeyDown (event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowUp') {
      if (selection > 0) setSelection(--selection)
    } else if (event.key === 'ArrowDown') {
      if (selection < matchingCommands.length - 1) setSelection(++selection)
    }
  }

  function handleValueChange (value: string) {
    setSearch(value)
    setSelection(0)
  }

  return (
    <div className={classes.Palette} onKeyDown={handleKeyDown}>
      <Line context={context.state} value={search} onChange={handleValueChange} />
      <div className={classes.Commands}>
        {matchingCommands.map((command, i) => {
          let classNames = [classes.Command]
          if (i === selection) classNames.push(classes.Command_selected)
          return (
            <div key={command.subject + command.name} className={classNames.join(' ')}>
              <div className={classes.CommandName}>
                {command.name}
                <span className={classes.CommandContext}>{command.subject}</span>
              </div>
              <div className={classes.CommandDescription}>{command.description}</div>
            </div>
          )
        })}
      </div>
    </div>
  ) 
}

/*======*\
*  Line  *
\*======*/

type LineProps = {
  value: string,
  context: CommandContextState,
  onChange: (value: string) => void
}
type InputEventHandler = ChangeEventHandler<HTMLInputElement>

function Line(props: LineProps) {
  let handleChange: InputEventHandler = ({ target }) => {
    props.onChange(target.value)
  }

  return (
    <div className={classes.Line}>
      <div className={classes.Contexts}>
        {Array.from(props.context).reverse().map((context) => (
          <div key={`${context.name}+${context.id || ''}`} className={classes.Context}>{context.name}</div>
        ))}
      </div>
      <div className={classes.Chevron}>&rsaquo;</div>
      <input autoFocus className={classes.Input} value={props.value} placeholder="Command" onChange={handleChange}/>
    </div>
  )
}

/*=========*\
*  Helpers  *
\*=========*/

function sortSubjectsByDepth(context: CommandContextState) {
  return (a: Command<any>, b: Command<any>) => {
    let ia = context.findIndex((subject) => subject.name == a.subject)
    let ib = context.findIndex((subject) => subject.name == b.subject)
    return ib - ia
  }
}

function matchesContext(subjects: Set<string>) {
  return (command: Command<any>) => subjects.has(command.subject)
}

function matchesSearch(value: string) {
  let v = value.toLocaleLowerCase()
  return (command: Command<any>) => {
    let name = command.name.toLocaleLowerCase()
    return name.startsWith(v)
  }
}

/*============*\
*  CommandSet  *
\*============*/

interface CommandSetProps<T> {
  subject: string,
  commands: Array<{
    name: string,
    description: string,
    onSubmit: (model: T) => void
  }>
}

export function CommandSet<T>(props: CommandSetProps<T>) {
  return null
}