import React, { useState } from 'react'
import classes from './DesignSystem.module.scss'
import { DateTime, Duration } from 'luxon'
import { RouteComponentProps } from '@reach/router'

import { Textbox } from '../controls/Textbox'
import { Timebox } from '../controls/Timebox'
import { Durationbox } from '../controls/Durationbox'
import { Selectable, MultiSelectable } from '../controls/Selectable'
import { CommandPalette } from '../commands'

type Props = RouteComponentProps
type State = {
  time: DateTime
  dur: Duration
  color: string,
  bkgs: string[]
}

export default class DesignSystem extends React.Component<Props, State> {
  state: State = {
    time: DateTime.local(),
    dur: Duration.fromObject({ hours: 1, minutes: 30 }),
    color: 'red',
    bkgs: ['papayawhip']
  }

  updateTime = (time: DateTime) => this.setState({ time })
  updateDuration = (dur: Duration) => this.setState({ dur })
  updateColor = (color: string, option: string, isSelected: boolean) => this.setState({ color })
  updateGem = (bkgs: string[], option: string, isSelected: boolean) => this.setState({ bkgs })

  render () {
    let { time, dur, color, bkgs } = this.state
    return (
      <div className={classes.DesignSystem}>
        <h1>Design System</h1>
        <section>
          <h2>Boxes</h2>
          <label htmlFor="textbox">Textbox</label>
          <Textbox id="textbox" defaultValue="hello" />
          <label htmlFor="timebox">Timebox</label>
          <Timebox id="timebox" time={time} onChange={this.updateTime} />
          <label htmlFor="durationbox">Durationbox</label>
          <Durationbox id="durationbox" value={dur} onChange={this.updateDuration} />
        </section>
        <section>
          <h2>Selectable</h2>
          <Selectable required value={color} options={['red', 'green', 'blue']} onChange={this.updateColor} optionRenderer={
            (color, isSelected, triggerSelect) => (
              <span key={color} style={isSelected ? { color, fontWeight: 'bold' }: {}} onClick={triggerSelect}>{color}</span>
            )}/>
          <MultiSelectable value={bkgs} options={['papayawhip', 'whitesmoke', 'azure']} onChange={this.updateGem} optionRenderer={
            (bkg, isSelected, triggerSelect) => (
              <span key={bkg} style={isSelected ? { backgroundColor: bkg, fontWeight: 'bold' } : {}} onClick={triggerSelect}>{bkg}</span>
            )}/>
        </section>
      </div>
    )
  }
}