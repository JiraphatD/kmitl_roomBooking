import 'core-js';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { StyledEngineProvider } from '@mui/material/styles';
import './index.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  
    <StyledEngineProvider injectFirst>
      <App />
    </StyledEngineProvider>
  
)
