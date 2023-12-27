import App from './App.jsx';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { devMode } from './lib.js';
import { logWebVitals } from './reportWebVitals.js';

ReactDOM.createRoot(document.querySelector('#root')).render(
    <React.StrictMode>
        <BrowserRouter basename="/cartracker">
            <App />
        </BrowserRouter>
    </React.StrictMode>,
);

if (devMode) {
    console.log('Environment:', import.meta.env);
    logWebVitals();
}
