import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { RouterProvider } from 'react-router-dom';
import routes from "./router"
import './style.css';
import { store } from './app/store';
import { Provider } from 'react-redux';
import ReactGA from "react-ga4";

import { CookiesProvider } from 'react-cookie';

ReactGA.initialize("G-6N1Q7S5NLP");
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CookiesProvider  defaultSetOptions={{ path: '/' }}>
      <Provider store={store}>
        <RouterProvider router={routes} />
      </Provider>
    </CookiesProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
