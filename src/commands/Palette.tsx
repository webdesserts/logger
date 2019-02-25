import React, { useState, ChangeEventHandler, KeyboardEvent, useRef, RefObject, useImperativeHandle, Ref, } from 'react'
import classes from './Palette.module.scss'
import { usePaletteContext, PaletteContextState, SubjectPayload } from './models/context.model';
import { useTriggersManager } from './PaletteTrigger';

export { Palette }

/*================*\
*  CommandPalette  *
\*================*/

type Command = { subject: string, collection: true, name: string, description: string, onSubmit: (id: string) => void } |
               { subject: string, collection: false, name: string, description: string, onSubmit: (id?: string) => void }
interface SubjectElement extends React.ReactElement<SubjectProps, typeof Subject> {}
type Props = {
  children?: SubjectElement | SubjectElement[]
}

function Palette(props: Props) {
  let blockRef = useRef(null)
  let lineRef = useRef(null) as RefObject<LineRef>
  let context = usePaletteContext()
  useTriggersManager(blockRef, () => {
    if (lineRef.current) lineRef.current.focus()
  })

  let subjects = new Set<string>();
  let commands = [] as Command[];
  let [search, setSearch] = useState("")
  let [selection, setSelection] = useState(0)

  let children: React.ReactElement<SubjectProps, typeof Subject>[] = []
  children = children.concat(props.children || [])

  for (let child of children) {
    let subject = child.props
    subjects.add(subject.type)
    for (let command of subject.commands) {
      commands.push(Object.assign({ subject: subject.type, collection: subject.collection }, command) as Command)
    }
  }

  let matchingCommands = commands
    .filter(matchesContext(context.state))
    .filter(matchesSearch(search))
    .sort(sortSubjectsByDepth(context.state))

  function handleKeyDown (event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowUp') {
      if (selection > 0) setSelection(--selection)
    } else if (event.key === 'ArrowDown') {
      if (selection < matchingCommands.length - 1) setSelection(++selection)
    } else if (event.key === 'Enter') {
      let command = matchingCommands[selection]
      let subject = matchingSubject(command)
      submit(command, subject)
    }
  }

  function submit(command: Command, subject?: SubjectPayload) {
    if (subject) {
      if (command.collection && subject.id) {
        command.onSubmit(subject.id)
      } else if (!command.collection) {
        command.onSubmit(subject.id)
      }
    }
  }

  function matchingSubject(command: Command) {
    return context.state.find((subject) => subject.type === command.subject)
  }

  function handleClick(command: Command, i: number) {
    setSelection(i)
    let subject = matchingSubject(command)
    submit(command, subject)
  }

  function handleValueChange (value: string) {
    setSearch(value)
    setSelection(0)
  }

  return (
    <div ref={blockRef} className={classes.Palette} onKeyDown={handleKeyDown}>
      <Line ref={lineRef} context={context.state} value={search} onChange={handleValueChange} />
      <div className={classes.Commands}>
        {matchingCommands.map((command, i) => {
          let classNames = [classes.Command]
          if (i === selection) classNames.push(classes.Command_selected)
          return (
            <div key={command.subject + command.name} className={classNames.join(' ')} onClick={handleClick.bind(null, command, i)}>
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
  context: PaletteContextState,
  onChange: (value: string) => void
}
type InputEventHandler = ChangeEventHandler<HTMLInputElement>
type LineRef = { focus: () => void }

let Line = React.forwardRef(function Line(props: LineProps, ref: Ref<LineRef>) {
  let inputRef = useRef(null) as RefObject<HTMLInputElement>
  useImperativeHandle(ref, () => ({
    focus: () => {
      if (inputRef.current) inputRef.current.focus();
    }
  }));

  let handleChange: InputEventHandler = ({ target }) => {
    props.onChange(target.value)
  }

  return (
    <div className={classes.Line}>
      <div className={classes.Contexts}>
        {Array.from(props.context).reverse().map((subject) => (
          <div key={`${subject.type}+${subject.id || ''}`} className={classes.Context}>{subject.type}</div>
        ))}
      </div>
      <div className={classes.Chevron}>&rsaquo;</div>
      <input ref={inputRef} autoFocus className={classes.Input} value={props.value} placeholder="Command" onChange={handleChange}/>
    </div>
  )
})

/*=========*\
*  Helpers  *
\*=========*/

function sortSubjectsByDepth(context: PaletteContextState) {
  return (a: Command, b: Command) => {
    let ia = context.findIndex((subject) => subject.type == a.subject)
    let ib = context.findIndex((subject) => subject.type == b.subject)
    return ib - ia
  }
}

function matchesContext(context: PaletteContextState) {
  return (command: Command) => (
    context.some((subject) => Boolean(command.subject === subject.type && !command.collection || (command.collection && subject.id)))
  )
}

function matchesSearch(value: string) {
  let v = value.toLocaleLowerCase()
  return (command: Command) => {
    let name = command.name.toLocaleLowerCase()
    return name.startsWith(v)
  }
}

/*============*\
*  CommandSet  *
\*============*/

type SubjectRecordProps = {
  type: string,
  collection: true,
  commands: Array<{
    name: string,
    description: string,
    onSubmit: (id: string) => void
  }>
}

type SubjectEntityProps = {
  type: string,
  collection: false,
  commands: Array<{
    name: string,
    description: string,
    onSubmit: (id?:string) => void
  }>
}

type SubjectProps = SubjectRecordProps | SubjectEntityProps

export function Subject<T>(props: SubjectProps) {
  return null
}

Subject.defaultProps = {
  collection: false
}
