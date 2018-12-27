## TODOs

- What if we are focused on an Entry and we have a list of "related entries" INSIDE that entry. If we're focused on that entry, how do we "override" one entry with another?

# Redux State

We need to keep track of a few things. We need a place to store the context and what objects are associated with that context. It would be nice if the command palette automatically integrated with the context somehow, but I'm not sure if it's good to tie that logic together.

```ts
{
  context: [
    { name: 'Log' },
    { name: 'Log/Entry', id: 'a1b2c3' },
    { name: 'Log/Entry', id: 'd4e5f6' } // This Entry takes precedent
  ]
}
```

# Triggering a Context

```tsx
function useCommandContext(name, ref) {
  handleFocus() {
    linkContextOrSomefin()
  }

  useEffect(function linkContext() {
    if (ref && ref.current)  {
      ref.current.addEventListener('focus', handleFocus)
    }
    return function unlinkContext() {
      ref.current.removeEventListner('focus', handleFocus)
    }
  })
}

function MyComponent() {
  let divRef = useRef(null)

  useCommandContext('Entry', ref)

  return (
    <div ref={divRef}>
      {/* whatever I don't care */}
    </div>
  )
}
```

I think I like the hook better.

# Component Structure

We need a way to:

1. define a all commands and their associated parent contexts
2. tell the command Palette what context we're in

This isn't too far from a routing system, though these contexts aren't necessarily connected to the routes.

```tsx
  // In ma log/commands.tsx
  let LogCommands = () => (
    <Context name="Log">
      <Context name="Entry">
        <Command
          command="Edit"
          description=""
          onSubmit={() => dispatch(actions.creators.edit())}
          />
        <Command
          command="Delete"
          description=""
          renderer={( triggerClose ) => {
            triggerClose()
          }} />
      </Context>
    </Context>
  )
```

```tsx
  // In ma navigation
  <CommandPalette context={[
    { name: 'Log' },
    { name: 'Log/Entry', id: 'a1b2c3' },
    { name: 'Log/Entry', id: 'd4e5f6' }
  ]}>
    <LoggerCommands />
    <SchedulerCommands />
    <GlobalCommands />
  </CommandPalette>
```