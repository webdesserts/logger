import React, { useEffect } from 'react'
import { Router } from '@reach/router'
import { Log } from './log/Log'
import DesignSystem from './design-system/DesignSystem'
import { Palette, Subject, Command } from './commands/Palette';
import { useActiveEntry } from './log/stores/active_entry';
import { useEntries } from './log/stores/entries';
import { useAuth } from './utils/auth';
import * as Styled from './App.styles'
import { useSubjectTrigger } from './commands';

export function App() {
  let { isLoading, user, isAuthenticated, loginWithRedirect, logout, getTokenSilently } = useAuth()
  let active_entry = useActiveEntry()
  let entries = useEntries()
  useSubjectTrigger('Account')

  useEffect(() => {
    if (isAuthenticated) {
      getTokenSilently().then((token) => {
        console.log({ token })
      })
    }
  }, [isAuthenticated])

  if (isLoading) {
    return <Styled.App>Loading...</Styled.App>
  }

  console.log({
    isAuthenticated,
    isLoading,
    user
  })

  return (
    <Styled.App>
      <Router>
        <Log path="/" />
        <DesignSystem path="/design" />
      </Router>
      <Palette>
        <Subject type="Account">
          <Command name="login" description="Log in or Register to Logger" enabled={!isAuthenticated} onSubmit={loginWithRedirect}/>
          <Command name="logout" description="Log out of your account" enabled={isAuthenticated} onSubmit={logout}/>
        </Subject>
        <Subject type="Log">
          <Command name="start" description="Starts a new Entry" params={
            async () => {
              await sleep(300)
              return {
                sector: { type: 'string', required: true },
                project: { type: 'string', required: true },
                description: { type: 'string', required: true },
              } as const
          }} onSubmit={async (data) => {
            await active_entry.start(data)
          }}/>
        </Subject>

        <Subject type="Entry (Active)">
          <Command name="stop" description="Stops the log" onSubmit={async () => {
            await active_entry.stop()
          }} />
        </Subject>

        <Subject.WithId type="Entry">{(id: string) => {
          return <>
            <Command name="delete" description="Deletes an entry" onSubmit={async () => entries.delete(id)} />
            <Command name="edit" description="Edits an existing Entry"
              params={async () => {
                const entry = await entries.find(id)
                if (!entry) throw Error(`Could not find entry with id: ${id}`)
                return {
                  sector: { type: 'string', required: true, defaultValue: entry.sector },
                  project: { type: 'string', required: true, defaultValue: entry.project },
                  description: { type: 'string', required: true, defaultValue: entry.description },
                  start: { type: 'time', required: true, defaultValue: entry.start },
                  end: { type: 'time', required: true, defaultValue: entry.end }
                } as const
              }}
              onSubmit={async (data) => entries.update(id, data)} />
          </>
        }}
        </Subject.WithId>
      </Palette>
    </Styled.App>
  )
}

const sleep = (duration: number) => new Promise((resolve) => window.setTimeout(resolve, duration))