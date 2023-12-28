import Page from './components/Page.jsx';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { devMode } from './lib.js';
import { logWebVitals } from './reportWebVitals.js';

ReactDOM.createRoot(document.querySelector('#root')).render(
    <React.StrictMode>
        <BrowserRouter basename="/cartracker">
            <Page />
        </BrowserRouter>
    </React.StrictMode>,
);

if (devMode) {
    console.log('Environment:', import.meta.env);
    logWebVitals();
}
