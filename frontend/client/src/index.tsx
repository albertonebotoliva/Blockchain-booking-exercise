import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Drizzle, generateStore } from '@drizzle/store';
import { drizzleReactHooks } from '@drizzle/react-plugin';
import Reservation from './contracts/Reservation.json';

const options = { contracts: [Reservation] };
const drizzleStore = generateStore(options as any);
const drizzle = new Drizzle(options as any, drizzleStore);

ReactDOM.render(
  <React.StrictMode>
    <drizzleReactHooks.DrizzleProvider drizzle={drizzle}>
      <drizzleReactHooks.Initializer
        error="There was an error."
        loadingContractsAndAccounts="Loading Contracts and Accounts."
        loadingWeb3="Loading Web3."
      >
        <App />
      </drizzleReactHooks.Initializer>
    </drizzleReactHooks.DrizzleProvider>
  </React.StrictMode >,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
