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

import i18next from "i18next"
import { I18nextProvider } from "react-i18next"
import global_tr from "./transition/TR/global.json"
import global_en from "./transition/EN/global.json"
i18next.init({
  interpolation: { escapeValue: false },
  lng: "en",
  resources: {
    en: {
      global: global_en
    },
    tr: {
      global: global_tr
    }
  }
})

ReactGA.initialize("G-6N1Q7S5NLP");
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
      <I18nextProvider i18n={i18next} >
        <Provider store={store}>
          <RouterProvider router={routes} />
        </Provider>
      </I18nextProvider>
    </CookiesProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
