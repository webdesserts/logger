import React, { Component } from 'react';
import classes from './App.module.scss';
import { Textbox } from './Textbox';
import { Button } from './Button';

class App extends Component {
  render() {
    return (
      <div className={classes.App}>
        <div className={classes.overview}>
          <h1 className={classes.header}>Wednesday, October 22, 2018</h1>
          <div className={classes.stats}>
            <div className={classes.field}>
              <div className={classes.fieldLabel}>Day</div>
              <div className={classes.fieldItem}>3.2 hrs | 5 logs | .3 hrs/log</div>
            </div>
            <div className={classes.field}>
              <div className={classes.fieldLabel}>Average</div>
              <div className={classes.fieldItem}>3.2 hrs | 5 logs | .3 hrs/log</div>
            </div>
          </div>
        </div>
        <div className={classes.entries}>
          <Textbox />
          <Textbox />
          <Textbox />
          <Button className={classes.startBtn}>Start</Button>

          <Entry sector="Personal" project="Code" description="Website" />
          <Entry sector="Veracity" project="Design" description="Textboxes" />
          <Entry sector="Veracity" project="Manage" description="Trello Cards" />
          <Entry sector="Veracity" project="Code" description="Texboxes" />
        </div>
      </div>
    );
  }
}

let Entry = ({ sector, project, description }) => {
  return <>
    <div>{sector}</div>
    <div>{project}</div>
    <div>{description}</div>
    <div>24:00</div>
    <div>24:00</div>
    <div>0.5hrs</div>
  </>
}

export default App;

