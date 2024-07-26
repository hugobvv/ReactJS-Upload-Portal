/**
 * Project Name: ES6 Upload Portal
 * File: main.jsx
 * Author: Hugo Bouvet
 * Year: 2024
 *
 * Description: Main application component for file upload portal.
*/

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossOrigin="anonymous"></link>
    <App />
  </React.StrictMode>,
)
