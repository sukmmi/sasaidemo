import React from 'react'
import { Route, HashRouter, Switch } from 'react-router-dom';
import Main from './components/Main';
import ImageClassifier from './components/ImageClassifier';

export default props => (
    <HashRouter>
        <Switch>
          <Route exact path='/' component={ Main } />
          <Route exact path='/insight' component={ ImageClassifier } />
        </Switch>
    </HashRouter>
  )
