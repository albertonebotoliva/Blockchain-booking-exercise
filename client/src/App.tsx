import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import Availabilities from './views/availabilities';


import { drizzleReactHooks } from '@drizzle/react-plugin';

const App = () => {
  const drizzleState = drizzleReactHooks.useDrizzleState(drizzleState => ({
    accounts: drizzleState.accounts
  }));

  const { drizzle } = drizzleReactHooks.useDrizzle();

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Redirect to="/availabilities" />
        </Route>
        <Route exact path="/availabilities" component={() => <Availabilities drizzle={drizzle} drizzleState={drizzleState} />} />
      </Switch>
    </Router>
  )
};

export default App;
