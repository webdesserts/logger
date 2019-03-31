import React, { useState, ChangeEventHandler, KeyboardEvent, useRef, RefObject, useImperativeHandle, Ref, useContext, useEffect, } from 'react'
import classes from './Palette.module.scss'
import { usePaletteContext, PaletteContextState, PaletteContextModel } from './models/context.model';
import { useTriggersManager } from './PaletteTrigger';
import { CommandsModel, CommandState, CommandsProvider, CommandParams, DataFromParams, useCommands, CommandWithoutIdState, CommandWithIdState } from './models/commands.model';
import { PaletteForm } from './Form';
import { isEqual } from 'lodash'

export { Palette }

/*================*\
*  CommandPalette  *
\*================*/

type SubjectElement = React.ReactElement<SubjectProps, typeof Subject>
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

  let commands = CommandsModel.useState(CommandsModel.initialState)
  let [search, setSearch] = useState("")

  let children: React.ReactElement<SubjectProps, typeof Subject>[] = []
  children = children.concat(props.children || [])

  let matchingCommands = commands.state
    .filter(matchesSearch(search))
    .sort(sortSubjectsByDepth(context.state))

  let first_match = matchingCommands[0];
  let [selection, setSelection] = useState<CommandState | null>(null)
  let [pendingCommand, setPendingCommand] = useState<CommandState | null>(null)

  function matchingSubject(command: Command) {
    return context.state.find((subject) => subject.type === command.subject)
  }

  function handleSubmit(command: CommandState) {
    if (Object.entries(command.params).length) {
      setPendingCommand(command)
    } else {
      submitWithData(command, {})
    }
  }

  function submitWithData<P extends CommandParams, C extends CommandState<P>>(command: C, data: DataFromParams<P>) {
    let subject = matchingSubject(command)
    if (subject) {
      if (command.withId && subject.id) {
        command.onSubmit(subject.id, data)
      } else if (!command.withId) {
        (command as CommandWithoutIdState<P>).onSubmit(subject.id, data)
      }
    }
    setPendingCommand(null)
  }

  function handleValueChange (value: string) {
    setSearch(value)
  }

  function handleKeyDown (event: KeyboardEvent<HTMLElement>) {
    if (selection) {
      let index = matchingCommands.indexOf(selection)
      if (event.key === 'ArrowUp') {
        if (index > 0) setSelection(matchingCommands[--index])
      } else if (event.key === 'ArrowDown') {
        if (index < matchingCommands.length - 1) setSelection(matchingCommands[++index])
      } else if (event.key === 'Enter') {
        if (selection) handleSubmit(selection)
      }
    }
  }

  return (
    <CommandsProvider model={commands}>
      <div ref={blockRef} className={classes.Palette} onKeyDown={handleKeyDown}>
        {pendingCommand ? (
          <PaletteForm command={pendingCommand} onSubmit={submitWithData} />
        ) : <>
          <Line ref={lineRef} context={context} value={search} onChange={handleValueChange} onSubmit={() => { if (selection) handleSubmit(selection)}} />
          <CommandList
            commands={matchingCommands}
            selection={selection || first_match || null}
            onSubmit={handleSubmit}
          />
        </>}
        {children}
      </div>
    </CommandsProvider>
  ) 
}

/*======*\
*  Line  *
\*======*/

type LineProps = {
  value: string,
  context: PaletteContextModel,
  onChange: (value: string) => void,
  onSubmit: () => void
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

  function handleKeyDown (event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      props.onSubmit()
    }
  }

  return (
    <div className={classes.Line} onKeyDown={handleKeyDown}>
      <div className={classes.Contexts}>
        {Array.from(props.context.state).reverse().map((subject) => (
          <div key={`${subject.type}+${subject.id || ''}`} className={classes.Context}>{subject.type}</div>
        ))}
      </div>
      <div className={classes.Chevron}>&rsaquo;</div>
      <input ref={inputRef} autoFocus className={classes.Input} value={props.value} placeholder="Command" onChange={handleChange}/>
    </div>
  )
})

/*=============*\
*  CommandList  *
\*=============*/

type CommandListProps = {
  commands: CommandState[],
  selection: CommandState | null,
  onSubmit: (command: CommandState) => void
}

function CommandList (props: CommandListProps) {
  let { selection, commands, onSubmit } = props

  return (
    <div className={classes.Commands}>
      {commands.map((command, i) => {
        let classNames = [classes.Command]
        if (isEqual(command, selection)) classNames.push(classes.Command_selected)
        return (
          <div key={command.subject + command.name} className={classNames.join(' ')} onClick={onSubmit.bind(null, command)}>
            <div className={classes.CommandName}>
              {command.name}
              <span className={classes.CommandContext}>{command.subject}</span>
            </div>
            <div className={classes.CommandDescription}>{command.description}</div>
          </div>
        )
      })}
    </div>
  )
}

/*=========*\
*  Helpers  *
\*=========*/

function sortSubjectsByDepth(context: PaletteContextState) {
  return (a: CommandState, b: CommandState) => {
    let ia = context.findIndex((subject) => subject.type == a.subject)
    let ib = context.findIndex((subject) => subject.type == b.subject)
    return ib - ia
  }
}

function matchesContext(context: PaletteContextState) {
  return (command: CommandState) => (
    context.some((subject) => Boolean(command.subject === subject.type && !command.withId || (command.withId && subject.id)))
  )
}

function matchesSearch(value: string) {
  let v = value.toLocaleLowerCase()
  return (command: CommandState) => {
    let name = command.name.toLocaleLowerCase()
    return name.startsWith(v)
  }
}


/*=========*\
*  Subject  *
\*=========*/

type CommandElement = React.ReactElement<CommandProps<any>, typeof Command>

type SubjectProps = {
  type: string,
  children: CommandElement | CommandElement[]
}

let SubjectContext = React.createContext<string>('Global')

export function Subject(props: SubjectProps) {
  console.log('<Subject>')
  let { type, children  } = props
  let context = usePaletteContext()
  let contextHasSubject = context.state.some((subject) => subject.type === type)
  
  if (!contextHasSubject) return null

  return (
    <SubjectContext.Provider value={type}>
      {children}
    </SubjectContext.Provider>
  )
}

/*=========*\
*  Command  *
\*=========*/

type CommandProps<P extends CommandParams> = {
  name: string,
  description: string,
  params: P,
  onSubmit(id: string | null, data: DataFromParams<P>) : void 
}

type CommandWithIdProps<P extends CommandParams> = {
  name: string,
  description: string,
  params: P,
  onSubmit(id: string, data: DataFromParams<P>) : void 
}

function Command<P extends CommandParams>(props: CommandProps<P>) {
  console.log('<Command>')
  let subject = useContext(SubjectContext)
  let commands = useCommands()
  useEffect(setCommandEffect, [subject])

  function setCommandEffect() {
    let command: CommandWithoutIdState<P> = { subject, withId: false, ...props }
    commands.add(command)
    return () => {
      commands.remove(command)
    }
  }

  return null
}

function CommandWithId<P extends CommandParams>(props: CommandWithIdProps<P>) {
  console.log('<CommandWithId>')
  let subject = useContext(SubjectContext)
  let commands = useCommands()
  useEffect(setCommandEffect, [subject])

  function setCommandEffect() {
    let command: CommandWithIdState<P> = { subject, withId: true, ...props }
    commands.add(command)
    return () => {
      commands.remove(command)
    }
  }

  return null
}

Command.WithId = CommandWithId

export { Command as Command }

Command.defaultProps = CommandWithId.defaultProps = {
  params: {},
}