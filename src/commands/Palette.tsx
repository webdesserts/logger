import React, { useState, ChangeEventHandler, KeyboardEvent, useRef, RefObject, useImperativeHandle, Ref, useContext, useEffect, } from 'react'
import * as Styles from './Palette.styles'
import { usePaletteContext, PaletteContextModel, SubjectPayload } from './models/context.model';
import { useTriggersManager } from './PaletteTrigger';
import { CommandsModel, CommandState, CommandsProvider, CommandParams, DataFromParams, useCommands, } from './models/commands.model';
import { PaletteForm } from './Form';

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
    .sort(sortCommandsBySubjectDepth(context))

  let first_match = matchingCommands[0];
  let [selectedCommand, setSelectedCommand] = useState<CommandState | null>(null)
  let [pendingCommand, setPendingCommand] = useState<CommandState | null>(null)

  // SAME SUBJECT BUG:
  // Commands have no clue which subject id it's actually associated with.
  // Right now we are having a problem where we are using an old subject id as long as the pending subject is the same
  // I'm assuming this is mostly a timing issue, but the fact that the pending Subject apparently "sticks" could point
  // elsewhere

  // This is a stopgap in case we some how end up with a command and subject that don't match
  // TODO: I don't think we should ever need this. This should be handled at an "action level"
  if (pendingCommand && !context.hasSubject(pendingCommand.subject)) {
    setPendingCommand(null)
  }

  function handleSubmit (command: CommandState) {
    if (Object.entries(command.params).length) {
      if (context.hasSubject(command.subject)) {
        setPendingCommand(command)
      } else {
        throw new Error(`Tried to submit a form for subject ${command.subject}, but we couldn't find that subject in context`)
      }
    } else {
      submitWithData(command, {})
    }
  }

  function submitWithData<P extends CommandParams, C extends CommandState<P>>(command: C, data: DataFromParams<P>) {
    if (context.hasSubject(command.subject)) {
      command.onSubmit(data)
    }
    setPendingCommand(null)
  }

  function handleValueChange (value: string) {
    setSearch(value)
  }

  function handleKeyDown (event: KeyboardEvent<HTMLElement>) {
    if (selectedCommand) {
      let index = matchingCommands.indexOf(selectedCommand)
      if (event.key === 'ArrowUp') {
        if (index > 0) setSelectedCommand(matchingCommands[--index])
      } else if (event.key === 'ArrowDown') {
        if (index < matchingCommands.length - 1) setSelectedCommand(matchingCommands[++index])
      } else if (event.key === 'Enter') {
        if (selectedCommand) handleSubmit(selectedCommand)
      }
    }
  }

  // if (pendingCommand) {
  //   console.log('pending:', CommandsModel.display(pendingCommand))
  // }

  return (
    <CommandsProvider model={commands}>
      <Styles.Palette ref={blockRef} onKeyDown={handleKeyDown}>
        {pendingCommand ? (
          <PaletteForm command={pendingCommand} onSubmit={submitWithData} />
        ) : <>
          <Line ref={lineRef} context={context} value={search} onChange={handleValueChange} onSubmit={() => { if (selectedCommand) handleSubmit(selectedCommand)}} />
          <CommandList
            commands={matchingCommands}
            selection={selectedCommand || first_match || null}
            onSubmit={handleSubmit}
          />
        </>}
        {children}
      </Styles.Palette>
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
    <Styles.Line onKeyDown={handleKeyDown}>
      <Styles.Contexts>
        {Array.from(props.context.state).reverse().map((subject) => (
          <Styles.Context key={PaletteContextModel.display(subject)}>{subject.type}</Styles.Context>
        ))}
      </Styles.Contexts>
      <Styles.Chevron>&rsaquo;</Styles.Chevron>
      <Styles.Input ref={inputRef} autoFocus value={props.value} placeholder="Command" onChange={handleChange}/>
    </Styles.Line>
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
    <Styles.Commands>
      {commands.map((command, i) => {
        let isSelected = CommandsModel.isEqual(command, selection)
        return (
          <Styles.Command key={command.subject.type + command.name} isSelected={isSelected} onClick={onSubmit.bind(null, command)}>
            <Styles.CommandName>
              {command.name}
              <Styles.CommandContext>{command.subject.type}</Styles.CommandContext>
            </Styles.CommandName>
            <Styles.CommandDescription>{command.description}</Styles.CommandDescription>
          </Styles.Command>
        )
      })}
    </Styles.Commands>
  )
}

/*=========*\
*  Helpers  *
\*=========*/

function sortCommandsBySubjectDepth(context: PaletteContextModel) {
  return (a: CommandState, b: CommandState) => {
    let ia = context.findIndexOfSubjectWithType(a.subject.type)
    let ib = context.findIndexOfSubjectWithType(b.subject.type)
    return ib - ia
  }
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

type SubjectProps = {
  type: string,
  children:  React.ReactNode
}

type SubjectWithIdProps = {
  type: string,
  children: (id: string) => React.ReactNode
}

let SubjectContext = React.createContext<SubjectPayload>({ type: 'Global', id: null })

function Subject(props: SubjectProps) {
  let { type, children  } = props
  let context = usePaletteContext()
  let matchingSubject = context.findSubjectWithType(type)
  if (!matchingSubject) return null

  return (
    <SubjectContext.Provider value={matchingSubject}>
      {children}
    </SubjectContext.Provider>
  )
}

function SubjectWithId(props: SubjectWithIdProps) {
  let { type, children  } = props
  let context = usePaletteContext()
  let matchingSubject = context.findSubjectWithType(type)
  if (!matchingSubject || matchingSubject.id === null) return null

  return (
    <SubjectContext.Provider value={matchingSubject}>
      {children(matchingSubject.id)}
    </SubjectContext.Provider>
  )
}

Subject.WithId = SubjectWithId

export { Subject }


/*=========*\
*  Command  *
\*=========*/

type CommandProps<P extends CommandParams> = {
  name: string,
  description: string,
  params: P,
  onSubmit(data: DataFromParams<P>) : void 
}

export function Command<P extends CommandParams>(props: CommandProps<P>) {
  let subject = useContext(SubjectContext)
  let commands = useCommands()
  useEffect(setCommandEffect, [subject.type, subject.id])

  function setCommandEffect() {
    let command: CommandState<P> = { subject, ...props }
    commands.add(command)
    return () => {
      commands.remove(command)
    }
  }

  return null
}

Command.defaultProps = {
  params: {}
}