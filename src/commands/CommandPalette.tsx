import React, { ReactChild, useState, ChangeEventHandler, KeyboardEvent } from 'react'
import classes from './CommandPalette.module.scss'

/*================*\
*  CommandPalette  *
\*================*/

type Command = { context: string, name: string, description: string }
type Props = {
  children: ReactChild | ReactChild[],
  contexts: string[],
  commands: Command[]
}

function sortByContextDepth(contexts: string[]) {
  return (a: Command, b: Command) => {
    let ia = contexts.indexOf(a.context)
    let ib = contexts.indexOf(b.context)
    return ib - ia
  }
}

function matchesContext(contexts: string[]) {
  return (command: Command) => contexts.includes(command.context)
}

function matchesSearch(value: string) {
  let v = value.toLocaleLowerCase()
  return (command: Command) => {
    let name = command.name.toLocaleLowerCase()
    return name.startsWith(v)
  }
}

export function CommandPalette(props: Props) {
  let [value, setValue] = useState("")
  let [selection, setSelection] = useState(0)

  let contextCommands = props.commands
    .filter(matchesContext(props.contexts))
    .sort(sortByContextDepth(props.contexts))

  let matchingCommands = contextCommands.filter(matchesSearch(value))

  function handleKeyDown (event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowUp') {
      if (selection > 0) setSelection(--selection)
    } else if (event.key === 'ArrowDown') {
      if (selection < matchingCommands.length - 1) setSelection(++selection)
    }
  }

  function handleValueChange (value: string) {
    setValue(value)
    setSelection(0)
  }

  return (
    <div className={classes.Palette} onKeyDown={handleKeyDown}>
      <Line contexts={props.contexts} value={value} onChange={handleValueChange} />
      <div className={classes.Commands}>
        {matchingCommands.map((command, i) => {
          let classNames = [classes.Command]
          if (i === selection) classNames.push(classes.Command_selected)
          return (
            <div key={command.context+command.name} className={classNames.join(' ')}>
              <div className={classes.CommandName}>
                {command.name}
                <span className={classes.CommandContext}>{command.context}</span>
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
  contexts: string[],
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
        {Array.from(props.contexts).reverse().map((context) => (
          <div key={context} className={classes.Context}>{context}</div>
        ))}
      </div>
      <div className={classes.Chevron}>&rsaquo;</div>
      <input autoFocus className={classes.Input} value={props.value} placeholder="Command" onChange={handleChange}/>
    </div>
  )
}