import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import { drizzleReactHooks } from '@drizzle/react-plugin';
import Availabilities from './views';

const App = () => {
  const drizzleState = drizzleReactHooks.useDrizzleState((drizzleState: any) => ({
    accounts: drizzleState.accounts
  }));

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Redirect to="/availabilities" />
        </Route>
        <Route exact path="/availabilities" component={() => <Availabilities drizzleState={drizzleState} />} />
      </Switch>
    </Router>
  )
};

export default App;
